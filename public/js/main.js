const properties = document.getElementsByClassName('dashboard__property');

[...properties].forEach((prop) => {
    prop.addEventListener('click', () => {
        const id = prop.id.split('_')[1];

        elementId = id;

        const chev = document.getElementById('action_' + id);
        const detail = document.getElementById('detail_' + id);
        chev.classList.toggle('rotate');
        prop.classList.toggle('dashboard__property-primary');
        detail.classList.toggle('dashboard__property-details-hide');
    });
});

const transactions = document.getElementsByClassName('transactions__transaction');

[...transactions].forEach((trans) => {

})

// Property Search Function
function propertySearch() {
    const searchValue = document.getElementById('search').value.toUpperCase();

    [...properties].forEach((prop) => {
        const id = prop.id.split('_')[1];

        // Filter Data
        const p = document.getElementById('name_' + id);
        const textValue = p.innerHTML;
        const thisProperty = document.getElementById('property_' + id);

        if (textValue.toUpperCase().indexOf(searchValue) > -1) {
            thisProperty.style.display = '';
        } else {
            thisProperty.style.display = 'none';
        }
    });
}

// Assign Rent Total Function
function assignRentTotal(rentAmountEntered) {

    if (!rentAmountEntered) {
        rentAmountEntered = document.getElementById('rent').value;
    }

    rentAmountEntered = rentAmountEntered.toString();

    if (rentAmountEntered.includes('.')) {
        document.querySelector('.new-transaction__calc').innerHTML = rentAmountEntered;
    } else {
        document.querySelector('.new-transaction__calc').innerHTML = rentAmountEntered + '.00';
    }

    if (rentAmountEntered === '') {
        document.querySelector('.new-transaction__calc').innerHTML = '0.00';
    }
}