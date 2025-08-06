// Tab Navigation
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
});

// Utility function to show loading
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    element.innerHTML = '<div class="loading">Đang tính toán...</div>';
    element.style.display = 'block';
}

// Utility function to hide loading
function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'none';
}

// Find all valid subsets with sum equal to target (using bitmask, no recursion)
function findSubsetsWithSumBitmask(nums, target) {
    const n = nums.length;
    const result = [];
    const maskList = [];
    for (let mask = 1; mask < (1 << n); mask++) {
        let total = 0;
        for (let i = 0; i < n; i++) {
            if ((mask >> i) & 1) total += nums[i];
        }
        if (total === target) maskList.push(mask);
    }
    return maskList;
}

// DP bitmask: Tìm số nhóm tối đa và truy vết nhóm
function calculateOptimalGroups(N, K) {
    const nums = Array.from({length: N}, (_, i) => i + 1);
    const n = nums.length;
    const size = 1 << n;
    const dp = new Array(size).fill(0);
    const prev = new Array(size).fill(-1);
    const lastGroup = new Array(size).fill(-1);
    const validMasks = findSubsetsWithSumBitmask(nums, K);

    for (let mask = 0; mask < size; mask++) {
        for (let sub of validMasks) {
            if ((mask & sub) === 0) {
                const newMask = mask | sub;
                if (dp[newMask] < dp[mask] + 1) {
                    dp[newMask] = dp[mask] + 1;
                    prev[newMask] = mask;
                    lastGroup[newMask] = sub;
                }
            }
        }
    }
    // Tìm trạng thái có số nhóm tối đa
    let maxGroups = 0;
    let bestMask = 0;
    for (let mask = 0; mask < size; mask++) {
        if (dp[mask] > maxGroups) {
            maxGroups = dp[mask];
            bestMask = mask;
        }
    }
    // Truy vết lại các nhóm
    const groups = [];
    let cur = bestMask;
    while (cur !== 0 && lastGroup[cur] !== -1) {
        const group = [];
        for (let i = 0; i < n; i++) {
            if ((lastGroup[cur] >> i) & 1) group.push(nums[i]);
        }
        groups.push(group);
        cur = prev[cur];
    }
    groups.reverse();
    return { maxGroups, groups };
}

// Find maximum disjoint groups using brute force (no recursion)
function findMaxDisjointGroups(subsets, N) {
    const M = subsets.length;
    let bestGroups = [];
    let maxGroups = 0;
    

    
    // Try all possible combinations of subsets
    for (let mask = 1; mask < (1 << M); mask++) {
        const used = new Array(N + 1).fill(false);
        const currentGroups = [];
        let valid = true;
        
        // Check if this combination is valid (no overlapping members)
        for (let i = 0; i < M; i++) {
            if ((mask >> i) & 1) {
                // Check if any member in this subset is already used
                for (const num of subsets[i]) {
                    if (used[num]) {
                        valid = false;
                        break;
                    }
                }
                
                if (!valid) break;
                
                // Mark all members as used and add to current groups
                for (const num of subsets[i]) {
                    used[num] = true;
                }
                currentGroups.push(subsets[i]);
            }
        }
        
        // Update best result if this combination is valid and has more groups
        if (valid && currentGroups.length > maxGroups) {
            maxGroups = currentGroups.length;
            bestGroups = [...currentGroups];

        }
    }
    
    return { maxGroups, groups: bestGroups };
}

// Calculate optimal groups for balancing two teams
function findBalancedTargets(N1, N2, desiredGroups) {
    const results = [];
    const maxSum1 = (N1 * (N1 + 1)) / 2;
    const maxSum2 = (N2 * (N2 + 1)) / 2;
    
    // Try all possible K1 values for team 1
    for (let K1 = 1; K1 <= maxSum1; K1++) {
        const result1 = calculateOptimalGroups(N1, K1);
        
        if (result1.maxGroups === desiredGroups) {
            // Try all possible K2 values for team 2
            for (let K2 = 1; K2 <= maxSum2; K2++) {
                const result2 = calculateOptimalGroups(N2, K2);
                
                if (result2.maxGroups === desiredGroups) {
                    results.push({
                        K1: K1,
                        K2: K2,
                        groups1: result1.groups,
                        groups2: result2.groups
                    });
                }
            }
        }
    }
    
    return results;
}

// Feature 1: Calculate optimal groups
function calculateOptimal() {
    // First, make sure we're on the correct tab
    const feature1Tab = document.getElementById('feature1');
    if (feature1Tab) {
        feature1Tab.classList.add('active');
        // Hide other tabs
        document.getElementById('feature2').classList.remove('active');
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-tab="feature1"]').classList.add('active');
    }
    
    const N = parseInt(document.getElementById('n1').value);
    const K = parseInt(document.getElementById('k1').value);
    
    if (N < 1 || N > 20) {
        alert('Số lượng thành viên phải từ 1 đến 20');
        return;
    }
    
    if (K < 1) {
        alert('Target phải lớn hơn 0');
        return;
    }
    
    showLoading('result1');
    
    // Use setTimeout to prevent blocking the UI and ensure DOM is ready
    setTimeout(() => {
        try {
            const result = calculateOptimalGroups(N, K);
            
            // Ensure result1 is visible first
            const result1Element = document.getElementById('result1');
            if (result1Element) {
                result1Element.style.display = 'block';
                
                            // Now try to update the elements
            const maxGroupsElement = document.getElementById('maxGroups');
            const targetValueElement = document.getElementById('targetValue');
            
            if (maxGroupsElement && targetValueElement) {
                maxGroupsElement.textContent = result.maxGroups;
                targetValueElement.textContent = K;
            } else {
                console.error('Could not find maxGroups or targetValue elements');
                // Try to create them if they don't exist
                const resultInfo = document.querySelector('.result-info');
                if (resultInfo) {
                    resultInfo.innerHTML = `
                        <p><strong>Số nhóm tối đa:</strong> <span id="maxGroups">${result.maxGroups}</span></p>
                        <p><strong>Target:</strong> <span id="targetValue">${K}</span></p>
                    `;
                } else {
                    // If resultInfo doesn't exist, create the entire result structure
                    result1Element.innerHTML = `
                        <h3>Kết Quả:</h3>
                        <div class="result-info">
                            <p><strong>Số nhóm tối đa:</strong> <span id="maxGroups">${result.maxGroups}</span></p>
                            <p><strong>Target:</strong> <span id="targetValue">${K}</span></p>
                        </div>
                        <div class="groups-display">
                            <h4>Chi tiết các nhóm:</h4>
                            <div id="groupsList"></div>
                        </div>
                    `;
                }
            }
                
                const groupsList = document.getElementById('groupsList');
                if (groupsList) {
                    if (result.groups.length === 0) {
                        groupsList.innerHTML = '<p class="no-result">Không tìm thấy nhóm nào thỏa mãn</p>';
                    } else {
                        let groupsHTML = '<div class="groups-list">';
                        result.groups.forEach((group, index) => {
                            groupsHTML += `
                                <div class="group-item">
                                    <h5>Nhóm ${index + 1}</h5>
                                    <div class="group-members">
                                        ${group.map(num => `<span class="member">${num}</span>`).join('')}
                                    </div>
                                </div>
                            `;
                        });
                        groupsHTML += '</div>';
                        groupsList.innerHTML = groupsHTML;
                    }
                } else {
                    console.error('Could not find groupsList element');
                    // Try to create it if it doesn't exist
                    const groupsDisplay = document.querySelector('.groups-display');
                    if (groupsDisplay) {
                        if (result.groups.length === 0) {
                            groupsDisplay.innerHTML = '<h4>Chi tiết các nhóm:</h4><div id="groupsList"><p class="no-result">Không tìm thấy nhóm nào thỏa mãn</p></div>';
                        } else {
                            let groupsHTML = '<h4>Chi tiết các nhóm:</h4><div id="groupsList"><div class="groups-list">';
                            result.groups.forEach((group, index) => {
                                groupsHTML += `
                                    <div class="group-item">
                                        <h5>Nhóm ${index + 1}</h5>
                                        <div class="group-members">
                                            ${group.map(num => `<span class="member">${num}</span>`).join('')}
                                        </div>
                                    </div>
                                `;
                            });
                            groupsHTML += '</div></div>';
                            groupsDisplay.innerHTML = groupsHTML;
                        }
                    } else {
                        // If groupsDisplay doesn't exist, create the entire structure
                        const resultInfo = document.querySelector('.result-info');
                        if (resultInfo) {
                            resultInfo.insertAdjacentHTML('afterend', `
                                <div class="groups-display">
                                    <h4>Chi tiết các nhóm:</h4>
                                    <div id="groupsList">
                                        ${result.groups.length === 0 ? 
                                            '<p class="no-result">Không tìm thấy nhóm nào thỏa mãn</p>' :
                                            '<div class="groups-list">' + result.groups.map((group, index) => `
                                                <div class="group-item">
                                                    <h5>Nhóm ${index + 1}</h5>
                                                    <div class="group-members">
                                                        ${group.map(num => `<span class="member">${num}</span>`).join('')}
                                                    </div>
                                                </div>
                                            `).join('') + '</div>'
                                        }
                                    </div>
                                </div>
                            `);
                        }
                    }
                }
            } else {
                console.error('Could not find result1 element');
            }
        } catch (error) {
            console.error('Error:', error);
            const result1Element = document.getElementById('result1');
            if (result1Element) {
                result1Element.innerHTML = '<p class="no-result">Có lỗi xảy ra trong quá trình tính toán: ' + error.message + '</p>';
                result1Element.style.display = 'block';
            }
        }
    }, 100);
}

// Feature 2: Calculate balanced targets
function calculateBalance() {
    // First, make sure we're on the correct tab
    const feature2Tab = document.getElementById('feature2');
    if (feature2Tab) {
        feature2Tab.classList.add('active');
        // Hide other tabs
        document.getElementById('feature1').classList.remove('active');
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-tab="feature2"]').classList.add('active');
    }
    
    const N1 = parseInt(document.getElementById('team1Size').value);
    const N2 = parseInt(document.getElementById('team2Size').value);
    const desiredGroups = parseInt(document.getElementById('desiredGroups').value);
    
    if (N1 < 1 || N1 > 20 || N2 < 1 || N2 > 20) {
        alert('Số lượng thành viên phải từ 1 đến 20');
        return;
    }
    
    if (desiredGroups < 1) {
        alert('Số nhóm mong muốn phải lớn hơn 0');
        return;
    }
    
    showLoading('result2');
    
    // Use setTimeout to prevent blocking the UI and ensure DOM is ready
    setTimeout(() => {
        try {
            const results = findBalancedTargets(N1, N2, desiredGroups);
            
            // Ensure result2 is visible first
            const result2Element = document.getElementById('result2');
            if (result2Element) {
                result2Element.style.display = 'block';
                
                const balanceResults = document.getElementById('balanceResults');
                
                if (balanceResults) {
                    if (results.length === 0) {
                        balanceResults.innerHTML = `
                            <div class="no-result">
                                <p>Không tìm thấy cặp target nào thỏa mãn</p>
                                <p>Hãy thử giảm số nhóm mong muốn hoặc thay đổi số lượng thành viên</p>
                            </div>
                        `;
                    } else {
                        let resultsHTML = '';
                        results.forEach((result, index) => {
                            resultsHTML += `
                                <div class="balance-result">
                                    <h4>Phương án ${index + 1}</h4>
                                    
                                    <div class="team-result">
                                        <h5>Đội 1 (${N1} người) - Target: ${result.K1}</h5>
                                        <div class="groups-list">
                                            ${result.groups1.map((group, idx) => `
                                                <div class="group-item">
                                                    <h5>Nhóm ${idx + 1}</h5>
                                                    <div class="group-members">
                                                        ${group.map(num => `<span class="member">${num}</span>`).join('')}
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                    
                                    <div class="team-result">
                                        <h5>Đội 2 (${N2} người) - Target: ${result.K2}</h5>
                                        <div class="groups-list">
                                            ${result.groups2.map((group, idx) => `
                                                <div class="group-item">
                                                    <h5>Nhóm ${idx + 1}</h5>
                                                    <div class="group-members">
                                                        ${group.map(num => `<span class="member">${num}</span>`).join('')}
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            `;
                        });
                        balanceResults.innerHTML = resultsHTML;
                    }
                } else {
                    console.error('Could not find balanceResults element');
                    // Create the balanceResults element if it doesn't exist
                    result2Element.innerHTML = `
                        <h3>Kết Quả Cân Bằng:</h3>
                        <div id="balanceResults">
                            ${results.length === 0 ? `
                                <div class="no-result">
                                    <p>Không tìm thấy cặp target nào thỏa mãn</p>
                                    <p>Hãy thử giảm số nhóm mong muốn hoặc thay đổi số lượng thành viên</p>
                                </div>
                            ` : results.map((result, index) => `
                                <div class="balance-result">
                                    <h4>Phương án ${index + 1}</h4>
                                    
                                    <div class="team-result">
                                        <h5>Đội 1 (${N1} người) - Target: ${result.K1}</h5>
                                        <div class="groups-list">
                                            ${result.groups1.map((group, idx) => `
                                                <div class="group-item">
                                                    <h5>Nhóm ${idx + 1}</h5>
                                                    <div class="group-members">
                                                        ${group.map(num => `<span class="member">${num}</span>`).join('')}
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                    
                                    <div class="team-result">
                                        <h5>Đội 2 (${N2} người) - Target: ${result.K2}</h5>
                                        <div class="groups-list">
                                            ${result.groups2.map((group, idx) => `
                                                <div class="group-item">
                                                    <h5>Nhóm ${idx + 1}</h5>
                                                    <div class="group-members">
                                                        ${group.map(num => `<span class="member">${num}</span>`).join('')}
                                                    </div>
                                                </div>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `;
                }
            } else {
                console.error('Could not find result2 element');
            }
        } catch (error) {
            console.error('Error:', error);
            const result2Element = document.getElementById('result2');
            if (result2Element) {
                result2Element.innerHTML = '<p class="no-result">Có lỗi xảy ra trong quá trình tính toán</p>';
                result2Element.style.display = 'block';
            }
        }
    }, 100);
}

// Add input validation
document.addEventListener('DOMContentLoaded', function() {
    // Add input validation for all number inputs
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseInt(this.value);
            const min = parseInt(this.min);
            const max = parseInt(this.max);
            
            if (value < min) {
                this.value = min;
            } else if (value > max) {
                this.value = max;
            }
        });
    });
});
