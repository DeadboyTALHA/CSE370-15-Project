document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const authSection = document.getElementById('authSection');
    const dashboardSection = document.getElementById('dashboardSection');
    const modeToggle = document.getElementById('modeToggle');
    const modeToggleDashboard = document.getElementById('modeToggleDashboard');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotForm = document.getElementById('forgotForm');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const forgotPassword = document.getElementById('forgotPassword');
    const backToLogin = document.getElementById('backToLogin');
    const signinForm = document.getElementById('signinForm');
    const registerForm = document.getElementById('registerForm');
    const resetForm = document.getElementById('resetForm');
    const profileBtn = document.getElementById('profileBtn');
    const profileModal = document.getElementById('profileModal');
    const closeProfile = document.getElementById('closeProfile');
    const profileInfo = document.getElementById('profileInfo');
    const feedbackBtn = document.getElementById('feedbackBtn');
    const feedbackModal = document.getElementById('feedbackModal');
    const cancelFeedback = document.getElementById('cancelFeedback');
    const feedbackForm = document.getElementById('feedbackForm');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const signOutBtn = document.getElementById('signOutBtn');
    const foodSearch = document.getElementById('foodSearch');
    const searchBtn = document.getElementById('searchBtn');
    const resetSearchBtn = document.getElementById('resetSearchBtn');
    const financeBtn = document.getElementById('financeBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const foodTable = document.getElementById('foodTable').getElementsByTagName('tbody')[0];
    const wasteReportBtn = document.getElementById('wasteReportBtn');
    const vendingHistoryBtn = document.getElementById('vendingHistoryBtn');

    // Global variables
    let foodData = [];
    let currentUser = null;
    let isStaffUser = false;
    let currentFoodItem = null;
    let wasteData = [];
    let wasteChartInstance = null;

    // Function to toggle actions column visibility
    function toggleActionsColumn() {
        const actionsHeader = document.getElementById('actionsHeader');
        const actionCells = document.querySelectorAll('td.staff-actions');
        
        if (isStaffUser) {
            actionsHeader.classList.remove('hidden');
            actionCells.forEach(cell => cell.classList.remove('hidden'));
        } else {
            actionsHeader.classList.add('hidden');
            actionCells.forEach(cell => cell.classList.add('hidden'));
        }
    }

    // Function to fetch food data from server
    function fetchFoodData() {
        if (!currentUser) return;
        
        fetch('./get_food_data.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({userID: currentUser.id})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                foodData = data.foodItems;
                isStaffUser = data.isStaff;
                toggleActionsColumn();
                const userAllergies = data.user?.allergiesArray || [];
                console.log('User allergies:', userAllergies); // Debug log
                populateFoodTable(userAllergies);
            } else {
                alert('Error fetching food data: ' + data.message);
            }
        })
        .catch(error => {
            alert('Network error: ' + error.message);
        });
    }

    // Check if current time is within serving time
    function isWithinServingTime(servingTimeString) {
        if (!servingTimeString) return false;
        
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTimeInMinutes = currentHours * 60 + currentMinutes;
        
        const timeRanges = servingTimeString.split(', ');
        
        for (const timeRange of timeRanges) {
            const [startTime, endTime] = timeRange.split(' - ');
            
            const parseTime = (timeStr) => {
                const [time, modifier] = timeStr.split(' ');
                let [hours, minutes] = time.split(':').map(Number);
                
                if (modifier === 'PM' && hours !== 12) hours += 12;
                if (modifier === 'AM' && hours === 12) hours = 0;
                
                return hours * 60 + minutes;
            };
            
            const startTimeInMinutes = parseTime(startTime);
            const endTimeInMinutes = parseTime(endTime);
            
            if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes) {
                return true;
            }
        }
        
        return false;
    }

    // Check if user has allergy to food ingredients
    function hasAllergy(userAllergies, ingredients) {
        console.log('Checking allergy:', userAllergies, 'against ingredients:', ingredients);


        if (!userAllergies || userAllergies.length === 0 || !ingredients) return false;
        
        const ingredientList = ingredients.split(',').map(ing => ing.trim().toLowerCase());
        
        console.log('Ingredient list:', ingredientList);

        const result = userAllergies.some(allergy => {
            const allergyLower = allergy.toLowerCase().trim();
            console.log('Checking allergy:', allergyLower);
            
            const hasMatch = ingredientList.some(ingredient => {
                const ingredientWords = ingredient.split(' ');
                return ingredientWords.some(word => word.includes(allergyLower));
            });
            
            console.log('Allergy match result:', hasMatch);
            return hasMatch;
        });
        
        console.log('Final allergy result:', result);
        return result;
    }

    // Populate food table with data from database
    function populateFoodTable(userAllergies) {
        console.log('User allergies received:', userAllergies);
        console.log('Food data:', foodData);


        const tbody = foodTable;
        tbody.innerHTML = '';
        
        if (!foodData || foodData.length === 0) {
            const colspan = isStaffUser ? 9 : 8;
            tbody.innerHTML = `<tr><td colspan="${colspan}">No food data available</td></tr>`;
            return;
        }
        
        const normalItems = [];
        const allergyItems = [];
        
        foodData.forEach(foodItem => {
            const isServingTime = foodItem.ServingTimes ? isWithinServingTime(foodItem.ServingTimes) : false;
            const hasAllergyToFood = hasAllergy(userAllergies, foodItem.Ingredients);
            
            const item = {...foodItem};
            
            if (!isServingTime) {
                item.Available_Quantity = 0;
                item.Availability_Status = 'Not Serving';
            }
            
            if (hasAllergyToFood) {
                allergyItems.push(item);
            } else {
                normalItems.push(item);
            }
        });
        
        normalItems.forEach(foodItem => addFoodRow(foodItem, false));
        allergyItems.forEach(foodItem => addFoodRow(foodItem, true));
    }

    function addFoodRow(foodItem, hasAllergy) {
        const row = document.createElement('tr');
        
        if (hasAllergy) row.classList.add('allergy-warning');
        
        let rowHTML = `
            <td>${foodItem.F_Name}</td>
            <td>${foodItem.Ingredients || 'N/A'}</td>
            <td>${foodItem.Category || 'N/A'}</td>
            <td>${foodItem.CounterNos || 'N/A'}</td>
            <td>${foodItem.Price}</td>
            <td>${foodItem.ServingTimes || 'N/A'}</td>
            <td><span class="status ${foodItem.Availability_Status.toLowerCase().replace(' ', '-')}">${foodItem.Availability_Status}</span></td>
            <td>${foodItem.Available_Quantity}</td>
        `;
        
        if (isStaffUser) {
            rowHTML += `
                <td class="staff-actions">
                    <button class="btn-add" data-food="${foodItem.F_Name}">Add</button>
                    <button class="btn-sell" data-food="${foodItem.F_Name}">Sell</button>
                </td>
            `;
        } else {
            rowHTML += `<td class="staff-actions hidden"></td>`;
        }
        
        row.innerHTML = rowHTML;
        foodTable.appendChild(row);
        
        if (isStaffUser) {
            const addBtn = row.querySelector('.btn-add');
            const sellBtn = row.querySelector('.btn-sell');
            
            addBtn.addEventListener('click', () => {
                currentFoodItem = foodItem.F_Name;
                showQuantityDialog('add');
            });
            
            sellBtn.addEventListener('click', () => {
                currentFoodItem = foodItem.F_Name;
                showQuantityDialog('sell');
            });
        }
    }

    // Function to show quantity dialog for add/sell operations
    function showQuantityDialog(action) {
        const dialog = document.createElement('div');
        dialog.className = 'modal';
        dialog.id = 'quantityModal';
        dialog.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>${action === 'add' ? 'Add' : 'Sell'} ${currentFoodItem}</h2>
                <form id="quantityForm">
                    <div class="form-group">
                        <label for="quantity">Quantity:</label>
                        <input type="number" id="quantity" name="quantity" min="1" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn cancel-btn" id="cancelQuantity">Cancel</button>
                        <button type="submit" class="btn">${action === 'add' ? 'Add' : 'Sell'}</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(dialog);
        dialog.classList.remove('hidden');
        
        setTimeout(() => document.getElementById('quantity').focus(), 100);
        
        const closeBtn = dialog.querySelector('.close-modal');
        const cancelBtn = dialog.querySelector('#cancelQuantity');
        const form = dialog.querySelector('#quantityForm');
        
        const closeModal = () => {
            dialog.classList.add('hidden');
            setTimeout(() => document.body.removeChild(dialog), 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const quantity = parseInt(document.getElementById('quantity').value);
            
            if (quantity <= 0) {
                alert('Quantity must be greater than 0');
                return;
            }
            
            action === 'add' ? addFoodQuantity(currentFoodItem, quantity) : sellFoodQuantity(currentFoodItem, quantity);
            closeModal();
        });
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) closeModal();
        });
        
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // Function to handle adding food quantity
    function addFoodQuantity(foodName, quantity) {
        fetch('./update_food_quantity.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({foodName, quantity, action: 'add', userID: currentUser.id})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Successfully added ${quantity} ${foodName}(s)`);
                fetchFoodData();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => alert('An error occurred while updating quantity'));
    }

    // Function to handle selling food quantity
    function sellFoodQuantity(foodName, quantity) {
        fetch('./update_food_quantity.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({foodName, quantity, action: 'sell', userID: currentUser.id})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Successfully sold ${quantity} ${foodName}(s)`);
                fetchFoodData();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => alert('An error occurred while updating quantity'));
    }

    // Function to show waste report page
    function showWasteReport() {
        dashboardSection.classList.add('hidden');
        
        let wasteReportSection = document.getElementById('wasteReportSection');
        if (!wasteReportSection) {
            wasteReportSection = document.createElement('div');
            wasteReportSection.id = 'wasteReportSection';
            wasteReportSection.className = 'waste-report-section';
            wasteReportSection.innerHTML = `
                <header>
                    <div class="clock" id="wasteClock"></div>
                    <h1>Please, Don't Waste Food</h1>
                    <div class="header-buttons">
                        <button id="backToDashboard"><i class="fas fa-arrow-left"></i> Back to Dashboard</button>
                    </div>
                </header>
                <main>
                    <div class="chart-container">
                        <canvas id="wasteChart"></canvas>
                    </div>
                    <div id="wasteActions" class="hidden">
                        <button id="addWasteBtn" class="btn"><i class="fas fa-plus"></i> Add Today's Waste</button>
                    </div>
                </main>
            `;
            document.body.appendChild(wasteReportSection);
            
            document.getElementById('backToDashboard').addEventListener('click', () => {
                wasteReportSection.classList.add('hidden');
                dashboardSection.classList.remove('hidden');
            });
            
            document.getElementById('addWasteBtn').addEventListener('click', showAddWasteDialog);
        }
        
        wasteReportSection.classList.remove('hidden');
        updateWasteClock();
        fetchWasteData();
    }

    function updateWasteClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        
        const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
        const clockElement = document.getElementById('wasteClock');
        if (clockElement) clockElement.textContent = timeString;
    }

    function fetchWasteData() {
        fetch('./waste_operations.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({action: 'get_waste_data'})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                wasteData = data.wasteData;
                renderWasteChart();
            } else {
                alert('Error fetching waste data: ' + data.message);
            }
        })
        .catch(error => {
            alert('Network error: ' + error.message);
        });
    }

    function renderWasteChart() {
        const ctx = document.getElementById('wasteChart').getContext('2d');
        
        const labels = [];
        const dataValues = [];
        
        for (let i = 9; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            labels.push(dateString);
            
            const wasteEntry = wasteData.find(item => item.W_date === dateString);
            dataValues.push(wasteEntry ? wasteEntry.W_amount : 0);
        }
        
        if (wasteChartInstance) {
            wasteChartInstance.destroy();
        }
        
        wasteChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Food Waste (kg)',
                    data: dataValues,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Waste Amount (kg)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
        
        const wasteActions = document.getElementById('wasteActions');
        if (isStaffUser || (currentUser && ['staff', 'vendor', 'admin'].includes(currentUser.usertype))) {
            wasteActions.classList.remove('hidden');
        } else {
            wasteActions.classList.add('hidden');
        }
    }

    function canViewVendingHistory() {
        return currentUser && (currentUser.usertype === 'admin' || currentUser.usertype === 'vendor');
    }

    function toggleVendingHistoryButton() {
        if (vendingHistoryBtn) {
            if (canViewVendingHistory()) {
                vendingHistoryBtn.style.display = 'block';
            } else {
                vendingHistoryBtn.style.display = 'none';
            }
        }
    }

    function showVendingHistory() {
        if (!currentUser) return;
        
        fetch('./get_vending_history.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({userID: currentUser.id})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                let filteredHistory = data.vendingHistory;
                
                if (currentUser.usertype === 'vendor') {
                    const vendorName = currentUser.fullname;
                    filteredHistory = data.vendingHistory.filter(item => item.V_Name === vendorName);
                }
                
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content" style="max-width: 600px;">
                        <span class="close-modal">&times;</span>
                        <h2>Vending History</h2>
                        ${filteredHistory.length > 0 ? `
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Vendor Name</th>
                                        <th>Vending History</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${filteredHistory.map(item => `
                                        <tr>
                                            <td>${item.V_Name}</td>
                                            <td>${item.V_History}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        ` : '<p>No vending history found.</p>'}
                        <div class="modal-actions">
                            <button type="button" class="btn close-vending-history">Close</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                modal.classList.remove('hidden');
                
                const closeBtn = modal.querySelector('.close-modal');
                const closeActionBtn = modal.querySelector('.close-vending-history');
                
                const closeModal = () => {
                    modal.classList.add('hidden');
                    setTimeout(() => document.body.removeChild(modal), 300);
                };
                
                closeBtn.addEventListener('click', closeModal);
                closeActionBtn.addEventListener('click', closeModal);
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal();
                });
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            alert('Network error: ' + error.message);
        });
    }

    function showAddWasteDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'modal';
        dialog.id = 'wasteModal';
        dialog.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>Add Today's Waste</h2>
                <form id="wasteForm">
                    <div class="form-group">
                        <label for="wasteAmount">Waste Amount (kg):</label>
                        <input type="number" id="wasteAmount" name="wasteAmount" min="0" required>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn cancel-btn" id="cancelWaste">Cancel</button>
                        <button type="submit" class="btn">Add Waste</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(dialog);
        dialog.classList.remove('hidden');
        
        setTimeout(() => document.getElementById('wasteAmount').focus(), 100);
        
        const closeBtn = dialog.querySelector('.close-modal');
        const cancelBtn = dialog.querySelector('#cancelWaste');
        const form = dialog.querySelector('#wasteForm');
        
        const closeModal = () => {
            dialog.classList.add('hidden');
            setTimeout(() => document.body.removeChild(dialog), 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const wasteAmount = parseInt(document.getElementById('wasteAmount').value);
            
            if (wasteAmount < 0) {
                alert('Waste amount cannot be negative');
                return;
            }
            
            addWasteData(wasteAmount);
            closeModal();
        });
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) closeModal();
        });
        
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    function addWasteData(wasteAmount) {
        fetch('./waste_operations.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({
                action: 'add_waste',
                userID: currentUser.id,
                wasteAmount: wasteAmount
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                fetchWasteData();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => alert('An error occurred while adding waste data'));
    }

    // Initialize the page
    function init() {
        authSection.classList.remove('hidden');
        dashboardSection.classList.add('hidden');
        
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        forgotForm.classList.add('hidden');
        
        profileModal.classList.add('hidden');
        feedbackModal.classList.add('hidden');
        
        const wasteReportSection = document.getElementById('wasteReportSection');
        if (wasteReportSection) {
            wasteReportSection.classList.add('hidden');
        }
        
        signinForm.reset();
        registerForm.reset();
        resetForm.reset();
        feedbackForm.reset();
        
        updateModeToggleText();
    }
    
    function canViewFinance() {
        return currentUser && (currentUser.usertype === 'admin' || currentUser.usertype === 'vendor');
    }
    
    function toggleFinanceButton() {
        if (financeBtn) {
            if (canViewFinance()) {
                financeBtn.style.display = 'block';
            } else {
                financeBtn.style.display = 'none';
            }
        }
    }
    
    function showFinanceReport() {
        if (!currentUser) return;
        
        fetch('./get_finance_data.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({userID: currentUser.id})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.innerHTML = `
                    <div class="modal-content" style="max-width: 800px;">
                        <span class="close-modal">&times;</span>
                        <h2>Finance Report</h2>
                        ${data.financeData.length > 0 ? `
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Food Name</th>
                                        <th>Sold Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.financeData.map(item => `
                                        <tr>
                                            <td>${item.F_Date}</td>
                                            <td>${item.F_Name}</td>
                                            <td>${item.Sold_Quantity}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        ` : '<p>No finance data found.</p>'}
                        <div class="modal-actions">
                            <button type="button" class="btn close-finance-report">Close</button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                modal.classList.remove('hidden');
                
                const closeBtn = modal.querySelector('.close-modal');
                const closeActionBtn = modal.querySelector('.close-finance-report');
                
                const closeModal = () => {
                    modal.classList.add('hidden');
                    setTimeout(() => document.body.removeChild(modal), 300);
                };
                
                closeBtn.addEventListener('click', closeModal);
                closeActionBtn.addEventListener('click', closeModal);
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) closeModal();
                });
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            alert('Network error: ' + error.message);
        });
    }

    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        
        hours = hours % 12;
        hours = hours ? hours : 12;
        
        const timeString = `${hours}:${minutes}:${seconds} ${ampm}`;
        const clockElement = document.getElementById('clock');
        if (clockElement) clockElement.textContent = timeString;
    }

    function updateModeToggleText() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (modeToggle) modeToggle.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
        if (modeToggleDashboard) modeToggleDashboard.textContent = isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode';
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        updateModeToggleText();
    }

    function showDashboard() {
        authSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        toggleVendingHistoryButton();
        toggleFinanceButton();
        populateProfileInfo();
        fetchFoodData();
    }

    function populateProfileInfo() {
        if (!currentUser) return;
        
        fetch('./get_profile.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({userID: currentUser.id})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = data.user;
                toggleVendingHistoryButton();
                toggleFinanceButton();
                profileInfo.innerHTML = `
                    <p><strong>Full Name:</strong> ${currentUser.fullname}</p>
                    <p><strong>ID:</strong> ${currentUser.id}</p>
                    <p><strong>Username:</strong> ${currentUser.username}</p>
                    <p><strong>Email:</strong> ${currentUser.email}</p>
                    <p><strong>Allergies:</strong> ${currentUser.allergy || 'None'}</p>
                    <p><strong>User Type:</strong> ${currentUser.usertype.charAt(0).toUpperCase() + currentUser.usertype.slice(1)}</p>
                `;
            } else {
                alert('Error fetching profile information');
            }
        })
        .catch(error => alert('An error occurred while fetching profile information'));
    }

    // Initialize
    init();
    updateClock();
    setInterval(updateClock, 1000);
    setInterval(updateWasteClock, 1000);

    // Event Listeners
    if (modeToggle) modeToggle.addEventListener('click', toggleDarkMode);
    if (modeToggleDashboard) modeToggleDashboard.addEventListener('click', toggleDarkMode);
    if (wasteReportBtn) wasteReportBtn.addEventListener('click', showWasteReport);
    if (vendingHistoryBtn) vendingHistoryBtn.addEventListener('click', showVendingHistory);
    if (financeBtn) financeBtn.addEventListener('click', showFinanceReport);

    // Form navigation
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        forgotForm.classList.add('hidden');
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        forgotForm.classList.add('hidden');
    });

    forgotPassword.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        signupForm.classList.add('hidden');
        forgotForm.classList.remove('hidden');
    });

    backToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        forgotForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Form submissions
    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        fetch('./login.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({username, password})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentUser = data.user;
                showDashboard();
            } else {
                alert(data.message);
            }
        })
        .catch(error => alert('An error occurred during login'));
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fullname = document.getElementById('fullname').value;
        const id = document.getElementById('id').value;
        const newUsername = document.getElementById('newUsername').value;
        const newPassword = document.getElementById('newPassword').value;
        const email = document.getElementById('email').value;
        const allergy = document.getElementById('allergy').value;
        const usertype = document.getElementById('usertype').value;
        
        if (!fullname || !id || !newUsername || !newPassword || !email || !usertype) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (!email.endsWith('@g.bracu.ac.bd')) {
            alert('Email must be a valid BRAC University email ending with @g.bracu.ac.bd');
            return;
        }
        
        fetch('./signup.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({fullname, id, newUsername, newPassword, email, allergy, usertype})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                currentUser = {fullname, id, username: newUsername, email, allergy, usertype};
                showDashboard();
            } else {
                alert(data.message);
            }
        })
        .catch(error => alert('An error occurred during registration'));
    });

    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('resetEmail').value;
        
        if (!email) {
            alert('Please enter your email address');
            return;
        }
        
        alert(`Password reset code sent to ${email}`);
        forgotForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Button events
    refreshBtn.addEventListener('click', () => {
        fetchFoodData();
        alert('Food availability status refreshed!');
    });

    profileBtn.addEventListener('click', () => profileModal.classList.remove('hidden'));
    closeProfile.addEventListener('click', () => profileModal.classList.add('hidden'));
    feedbackBtn.addEventListener('click', () => feedbackModal.classList.remove('hidden'));
    cancelFeedback.addEventListener('click', () => feedbackModal.classList.add('hidden'));

    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').classList.add('hidden');
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) e.target.classList.add('hidden');
    });

    signOutBtn.addEventListener('click', () => {
        currentUser = null;
        isStaffUser = false;
        init();
    });

    // Feedback form
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('feedbackId').value;
        const message = document.getElementById('feedbackMessage').value;
        
        if (!id || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        fetch('./submit_feedback.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({userID: id, feedbackText: message})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                feedbackModal.classList.add('hidden');
                feedbackForm.reset();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => alert('An error occurred while submitting feedback'));
    });

    // Search functionality
    searchBtn.addEventListener('click', () => {
        const searchTerm = foodSearch.value.toLowerCase();
        const rows = foodTable.getElementsByTagName('tr');
        
        for (let row of rows) {
            if (row.cells.length > 0) {
                const foodName = row.cells[0].textContent.toLowerCase();
                const category = row.cells[2].textContent.toLowerCase();
                const shouldShow = foodName.includes(searchTerm) || category.includes(searchTerm);
                row.style.display = shouldShow ? '' : 'none';
            }
        }
    });

    resetSearchBtn.addEventListener('click', () => {
        foodSearch.value = '';
        const rows = foodTable.getElementsByTagName('tr');
        for (let row of rows) row.style.display = '';
    });

    foodSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchBtn.click();
    });
});