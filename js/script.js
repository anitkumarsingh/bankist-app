'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
	owner: 'Jonas Schmedtmann',
	movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
	interestRate: 1.2, // %
	pin: 1111
};

const account2 = {
	owner: 'Jessica Davis',
	movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
	interestRate: 1.5,
	pin: 2222
};

const account3 = {
	owner: 'Steven Thomas Williams',
	movements: [200, -200, 340, -300, -20, 50, 400, -460],
	interestRate: 0.7,
	pin: 3333
};

const account4 = {
	owner: 'Sarah Smith',
	movements: [430, 1000, 700, 50, 90],
	interestRate: 1,
	pin: 4444
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

let currentSortOrder = false;
const displayMovements = function (movements, sort = false) {
	const movs = sort ? movements.slice().sort((a,b)=>a-b):movements;
	containerMovements.innerHTML = '';
	movs.forEach((move, i) => {
		const type = move > 0 ? 'deposit' : 'withdrawal';
		const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${move}???</div>
    </div>
    `;
		containerMovements.insertAdjacentHTML('afterbegin', html);
	});
};

const createUserName = function (accs) {
	accs.forEach(function (acc) {
		acc.userName = acc.owner
			.toLowerCase()
			.split(' ')
			.map((user) => user[0])
			.join('');
	});
};

createUserName(accounts);

const displayBalance = function (accs) {
	accs.balance = accs.movements.reduce((acc, cur) => acc + cur);
	labelBalance.textContent = `${accs.balance}???`;
};

const displaySummary = (account) => {
	const deposit = account.movements
		.filter((mov) => mov > 0)
		.reduce((acc, curr) => acc + curr, 0);
	labelSumIn.textContent = `${deposit}???`;

	const withdraw = account.movements
		.filter((mov) => mov < 0)
		.reduce((acc, curr) => acc + curr, 0);
	labelSumOut.textContent = `${Math.abs(withdraw)}???`;

	const intersetCal = account.movements
		.filter((mov) => mov > 0)
		.map((m) => (m * account.interestRate) / 100)
		.reduce((acc, curr) => acc + curr, 0);
	labelSumInterest.textContent = `${intersetCal}???`;
};

const updateUI = (acc) => {
	displayMovements(acc.movements);
	displayBalance(acc);
	displaySummary(acc);
};
let currentUser;

btnLogin.addEventListener('click', function (e) {
	e.preventDefault();
	currentUser = accounts.find((acc) => acc.userName === inputLoginUsername.value);
	if (currentUser?.pin === Number(inputLoginPin.value)) {
		labelWelcome.textContent = `Welcome back, ${currentUser.owner.split(' ')[0]}`;
		containerApp.style.opacity = 100;
		inputLoginUsername.value = inputLoginPin.value = '';
		inputLoginPin.blur();
		updateUI(currentUser);
	}
});

btnTransfer.addEventListener('click', function (e) {
	e.preventDefault();
	const amtTranfer = Number(inputTransferAmount.value);
	const reciever = accounts.find(
		(acc) => acc.userName === inputTransferTo.value.toLowerCase()
	);
	inputTransferTo.value = inputTransferAmount.value = '';

	if (
		amtTranfer > 0 &&
		amtTranfer <= currentUser.balance &&
		reciever &&
		reciever?.userName !== currentUser.userName
	) {
		currentUser.movements.push(-amtTranfer);
		reciever.movements.push(amtTranfer);
		updateUI(currentUser);
	}
});

btnLoan.addEventListener('click', function (e) {
	e.preventDefault();
	const loanAmt = Number(inputLoanAmount.value);
	setTimeout(() => {
		currentUser.movements.push(loanAmt);
		updateUI(currentUser);
		inputLoanAmount.value = '';
	}, 1000);
});

btnClose.addEventListener('click', function (e) {
	e.preventDefault();
	if (
		currentUser.userName === inputCloseUsername.value &&
		currentUser.pin === Number(inputClosePin.value)
	) {
		inputCloseUsername.value = inputClosePin.value = '';
		const findCurrentUserIndex = accounts.findIndex(
			(acc) => acc.userName === currentUser.userName
		);
		accounts.splice(findCurrentUserIndex, 1);
		containerApp.style.opacity = 0;
	}
});

btnSort.addEventListener('click', function (e) {
	e.preventDefault();
	displayMovements(currentUser.movements,!currentSortOrder);
	currentSortOrder =!currentSortOrder;
});
const currencies = new Map([
	['USD', 'United States dollar'],
	['EUR', 'Euro'],
	['GBP', 'Pound sterling']
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
