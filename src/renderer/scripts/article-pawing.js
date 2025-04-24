const Swal = require('sweetalert2');

let articles = [];
let totalGoldValueSum = 0;
let totalInterestSum = 0;
let totalCalculatedLoanSum = 0;
let totalAdjustedLoanSum = 0;
let totalAdjustmentSum = 0;
let currentPage = 1;

function getArticleName() {
    const articleSelect = document.getElementById('articleSelect');
    const customArticle = document.getElementById('customArticle');
    
    if (articleSelect.style.display === 'none') {
        return customArticle.value.trim() || 'Unnamed Article';
    }
    return articleSelect.value;
}

function getDuration() {
    const durationSelect = document.getElementById('durationSelect');
    const customDuration = document.getElementById('customDuration');
    
    if (durationSelect.style.display === 'none') {
        return parseInt(customDuration.value) || 1;
    }
    return parseInt(durationSelect.value) || 1;
}

function getDurationText() {
    const durationSelect = document.getElementById('durationSelect');
    const customDuration = document.getElementById('customDuration');
    const duration = getDuration();
    
    if (durationSelect.style.display === 'none') {
        return duration + (duration === 1 ? " Month" : " Months");
    }
    if (durationSelect.value !== 'custom') {
        return durationSelect.options[durationSelect.selectedIndex].text;
    }
    return duration + (duration === 1 ? " Month" : " Months");
}

function calculateDueDate(durationMonths) {
    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setMonth(today.getMonth() + durationMonths);
    return dueDate.toLocaleDateString();
}

function calculateDailyInterest(totalInterest, durationMonths) {
    const daysInPeriod = durationMonths * 30;
    return totalInterest / daysInPeriod;
}

function calculateAndAddItem() {
    const grossWeight = parseFloat(document.getElementById('grossWeight').value) || 0;
    const netWeight = parseFloat(document.getElementById('netWeight').value) || 0;
    const karatValue = parseFloat(document.getElementById('karatValue').value) || 0;
    const articleName = getArticleName();
    const durationValue = getDuration();
    const durationText = getDurationText();
    const interestRate = parseFloat(document.getElementById('interestRate').value) || 0;
    const pawnValue = parseFloat(document.getElementById('pawnValue').value) || 0;
    const notes = document.getElementById('notes').value || '';

    if (netWeight <= 0 || karatValue <= 0 || !articleName || durationValue <= 0 || interestRate < 0 || pawnValue <= 0) {
        Swal.fire({
            title: 'Invalid Input',
            text: 'Please fill all required fields with valid values.',
            icon: 'error',
            confirmButtonColor: '#d33', 
            confirmButtonText: 'OK'
        });
        return;
    }

    const valuePerGram = pawnValue / 8;
    const goldValue = netWeight * valuePerGram;
    const interestAmount = (goldValue * interestRate * durationValue) / 100;
    const calculatedLoanAmount = goldValue - interestAmount;
    const dailyInterest = calculateDailyInterest(interestAmount, durationValue);
    const dueDate = calculateDueDate(durationValue);

    const article = {
        id: Date.now(),
        name: articleName,
        grossWeight: grossWeight,
        weight: netWeight,
        karat: karatValue,
        duration: durationValue,
        durationText: durationText,
        interestRate: interestRate,
        goldValue: goldValue,
        dailyInterest: dailyInterest,
        interest: interestAmount,
        calculatedLoan: calculatedLoanAmount,
        adjustedLoan: calculatedLoanAmount,
        adjustment: 0,
        dueDate: dueDate,
        notes: notes
    };

    articles.push(article);
    updateArticlesTable();

    document.getElementById('grossWeight').value = '';
    document.getElementById('netWeight').value = '';
    document.getElementById('karatValue').value = '';
    
    const articleSelect = document.getElementById('articleSelect');
    const customArticle = document.getElementById('customArticle');
    const clearArticle = document.getElementById('clearArticle');
    articleSelect.style.display = 'block';
    customArticle.style.display = 'none';
    clearArticle.style.display = 'block';
    articleSelect.value = 'Necklace';
    customArticle.value = '';
    
    const durationSelect = document.getElementById('durationSelect');
    const customDuration = document.getElementById('customDuration');
    const clearDuration = document.getElementById('clearDuration');
    durationSelect.style.display = 'block';
    customDuration.style.display = 'none';
    clearDuration.style.display = 'block';
    durationSelect.value = '1';
    customDuration.value = '';
    
    document.getElementById('interestRate').value = '';
    document.getElementById('pawnValue').value = '';
    document.getElementById('notes').value = '';

    document.getElementById('nextBtn').disabled = false;
}

function updateArticlesTable() {
    const tableBody = document.getElementById('articlesTableBody');
    tableBody.innerHTML = '';

    totalGoldValueSum = 0;
    totalInterestSum = 0;
    totalCalculatedLoanSum = 0;
    totalAdjustedLoanSum = 0;
    totalAdjustmentSum = 0;

    articles.forEach(article => {
        const row = document.createElement('tr');
        row.dataset.id = article.id;
        
        const adjustedLoanInput = document.createElement('input');
        adjustedLoanInput.type = 'number';
        adjustedLoanInput.value = article.adjustedLoan.toFixed(2);
        adjustedLoanInput.className = 'adjustable-loan';
        adjustedLoanInput.dataset.id = article.id;
        adjustedLoanInput.addEventListener('change', function() {
            updateAdjustedLoanAmount(article.id, parseFloat(this.value) || 0);
        });
        
        const interestRateInput = document.createElement('input');
        interestRateInput.type = 'number';
        interestRateInput.value = article.interestRate;
        interestRateInput.className = 'adjustable-interest';
        interestRateInput.dataset.id = article.id;
        interestRateInput.addEventListener('change', function() {
            updateInterestRate(article.id, parseFloat(this.value) || 0);
        });
        
        const adjustmentCell = document.createElement('td');
        const adjustment = article.adjustment;
        if (adjustment > 0) {
            adjustmentCell.innerHTML = `<span class="positive-adjustment">+${adjustment.toFixed(2)}</span>`;
        } else if (adjustment < 0) {
            adjustmentCell.innerHTML = `<span class="negative-adjustment">${adjustment.toFixed(2)}</span>`;
        } else {
            adjustmentCell.innerHTML = `<span class="zero-adjustment">0.00</span>`;
        }

        row.innerHTML = `
            <td title="${article.notes ? 'Note: ' + article.notes : ''}">${article.name}</td>
            <td>${article.weight.toFixed(2)} g${article.grossWeight ? ' (Gross: ' + article.grossWeight.toFixed(2) + ' g)' : ''}</td>
            <td>${article.karat}K</td>
            <td>${article.durationText}</td>
            <td>${article.dueDate}</td>
            <td>LKR ${article.goldValue.toFixed(2)}</td>
            <td></td>
            <td>LKR ${article.dailyInterest.toFixed(2)}</td>
            <td>LKR ${article.interest.toFixed(2)}</td>
            <td>LKR ${article.calculatedLoan.toFixed(2)}</td>
            <td></td>
            <td></td>
            <td>
                <button class="btn-delete" data-id="${article.id}">Delete</button>
            </td>
        `;
        
        row.cells[6].appendChild(interestRateInput);
        row.cells[10].appendChild(adjustedLoanInput);
        row.cells[11].replaceWith(adjustmentCell);
        
        tableBody.appendChild(row);
        
        totalGoldValueSum += article.goldValue;
        totalInterestSum += article.interest;
        totalCalculatedLoanSum += article.calculatedLoan;
        totalAdjustedLoanSum += article.adjustedLoan;
        totalAdjustmentSum += article.adjustment;
    });

    document.getElementById('totalGoldValue').textContent = 'LKR ' + totalGoldValueSum.toFixed(2);
    document.getElementById('totalInterest').textContent = 'LKR ' + totalInterestSum.toFixed(2);
    document.getElementById('totalCalculatedLoan').textContent = 'LKR ' + totalCalculatedLoanSum.toFixed(2);
    document.getElementById('totalAdjustedLoan').textContent = 'LKR ' + totalAdjustedLoanSum.toFixed(2);

    const totalAdjustmentElement = document.getElementById('totalAdjustment');
    if (totalAdjustmentSum > 0) {
        totalAdjustmentElement.innerHTML = `<span class="positive-adjustment">+LKR ${totalAdjustmentSum.toFixed(2)}</span>`;
    } else if (totalAdjustmentSum < 0) {
        totalAdjustmentElement.innerHTML = `<span class="negative-adjustment">LKR ${totalAdjustmentSum.toFixed(2)}</span>`;
    } else {
        totalAdjustmentElement.innerHTML = `<span class="zero-adjustment">LKR 0.00</span>`;
    }

    document.getElementById('totalLoanPanel').style.display = articles.length > 0 ? 'block' : 'none';
}
function updateAdjustedLoanAmount(id, newValue) {
    const articleIndex = articles.findIndex(article => article.id === id);
    if (articleIndex === -1) return;

    const article = articles[articleIndex];
    article.adjustedLoan = newValue;
    article.adjustment = newValue - article.calculatedLoan;

    updateArticlesTable();
}

function updateInterestRate(id, newRate) {
    const articleIndex = articles.findIndex(article => article.id === id);
    if (articleIndex === -1) return;

    const article = articles[articleIndex];
    const currentAdjustedLoan = article.adjustedLoan;
    
    article.interestRate = newRate;
    article.interest = (article.goldValue * newRate * article.duration) / 100;
    article.dailyInterest = calculateDailyInterest(article.interest, article.duration);
    article.calculatedLoan = article.goldValue - article.interest;
    article.adjustedLoan = currentAdjustedLoan;
    article.adjustment = article.adjustedLoan - article.calculatedLoan;

    updateArticlesTable();
}

function deleteArticle(id) {
    articles = articles.filter(article => article.id !== id);
    updateArticlesTable();
    document.getElementById('nextBtn').disabled = articles.length === 0;
}

function nextPage() {
    console.log("hii");
    
    alert("Next page functionality to be implemented");
}

function resetForm() {
    document.getElementById('grossWeight').value = '';
    document.getElementById('netWeight').value = '';
    document.getElementById('karatValue').value = '';
    document.getElementById('articleSelect').value = 'Necklace';
    document.getElementById('customArticle').value = '';
    document.getElementById('durationSelect').value = '1';
    document.getElementById('customDuration').value = '';
    document.getElementById('interestRate').value = '';
    document.getElementById('pawnValue').value = '';
    document.getElementById('notes').value = '';
    articles = [];
    updateArticlesTable();
}

document.addEventListener('DOMContentLoaded', () => {

    const addItemBtn = document.querySelector('.btn-next:not(#nextBtn)');
    const nextBtn = document.getElementById('nextBtn');
    const resetBtn = document.querySelector('.btn-secondary');
    const clearArticle = document.getElementById('clearArticle');
    const clearDuration = document.getElementById('clearDuration');
    const articlesTableBody = document.getElementById('articlesTableBody');

  
  
    if (addItemBtn) {
        addItemBtn.addEventListener('click', calculateAndAddItem);
    } else {
        console.log('Add Article button not found');
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', nextPage);
    } else {
        console.log('Next button not found');
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            Swal.fire({
                title: 'Are you sure?',
                text: 'Resetting the form will clear all entered data.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#FFC107', 
                confirmButtonText: 'Yes, reset',
                cancelButtonText: 'Cancel',
                customClass: {
                    cancelButton: 'btn-secondary' 
                },
                buttonsStyling: true 
            }).then((result) => {
                if (result.isConfirmed) {
                    resetForm();
                    Swal.fire({
                        title: 'Success',
                        text: 'The form has been successfully reset.',
                        icon: 'success',
                        confirmButtonColor: '#FFC107', 
                        confirmButtonText: 'OK'
                    });
                }
            });
        });
    } else {
        console.log('Reset button not found');
    }

    if (clearArticle) {
        clearArticle.addEventListener('click', () => {
            document.getElementById('articleSelect').style.display = 'none';
            document.getElementById('customArticle').style.display = 'block';
            clearArticle.style.display = 'none';
            document.getElementById('customArticle').focus();
        });
    } else {
        console.log('Clear Article button not found');
    }

    if (clearDuration) {
        clearDuration.addEventListener('click', () => {
            document.getElementById('durationSelect').style.display = 'none';
            document.getElementById('customDuration').style.display = 'block';
            clearDuration.style.display = 'none';
            document.getElementById('customDuration').focus();
        });
    } else {
        console.log('Clear Duration button not found');
    }

    if (articlesTableBody) {
        articlesTableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-delete')) {
                const articleId = parseInt(e.target.dataset.id, 10);
                if (!isNaN(articleId)) {
                    Swal.fire({
                        title: 'Are you sure?',
                        text: 'Removing this article is permanent and cannot be undone.',
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#FFC107', 
                        confirmButtonText: 'Yes, remove',
                        cancelButtonText: 'Cancel',
                        customClass: {
                            cancelButton: 'btn-secondary'
                        },
                        buttonsStyling: true 
                    }).then((result) => {
                        if (result.isConfirmed) {
                            deleteArticle(articleId);
                            Swal.fire({
                                title: 'Success',
                                text: 'The article has been successfully removed.',
                                icon: 'success',
                                confirmButtonColor: '#FFC107',
                                confirmButtonText: 'OK'
                            });
                        }
                    });
                }
            }
        });
    } else {
        console.log('Articles table body not found');
    }
});