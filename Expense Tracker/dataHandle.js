import { generateNextId, formatExpense, printTable, getCurrentDate, numberVerification } from './module.js';
import { writeFile, stat, mkdir, readFile } from 'fs/promises';
import path, { join } from 'path';

const DATA_FOLDER = path.resolve('./data');
const DATA_FILE = path.join(DATA_FOLDER, 'data.json');


/* ADD EXPENSE */
export async function addItem(description, amount) {

    /* number verification */
    numberVerification(undefined, amount);
    amount = Number(amount);

    try {
        await stat(DATA_FOLDER);
    } catch (err) {
        if (err.code === 'ENOENT') {
            await mkdir(DATA_FOLDER, { recursive: true });
            await writeFile(
                DATA_FILE,
                JSON.stringify([formatExpense(description, numericAmount, 1)], null, 2),
                'utf8'
            );
            console.log('Expense added successfully (ID: 1)');
            return;
        }
        throw err;
    }

    try {



        /* read existing data */
        const fileContent = await readFile(DATA_FILE, 'utf8');
        const expenses = JSON.parse(fileContent);

        /* generate new ID */
        const newId = generateNextId(expenses);

        /* add new expense */
        const updatedData = JSON.stringify(
            [...expenses, formatExpense(description, amount, newId)],
            null,
            2
        );

        await writeFile(DATA_FILE, updatedData, 'utf8');
        console.log(`Expense added successfully (ID: ${newId})`);
    } catch (err) {
        console.log(err.message);
    }
}

/* LIST EXPENSES */
export async function list() {

    try {
        await stat(DATA_FOLDER);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('No expenses found.');
            return;
        }
        throw err;
    }


    try {
        const fileContent = await readFile(DATA_FILE, 'utf8');
        const expenses = JSON.parse(fileContent);

        printTable(expenses);
    } catch (err) {
        console.log(err.message);
    }
}

/* DELETE EXPENSE */
export async function deleteItem(id) {

    /* number verification */
    numberVerification(id, undefined);
    id = Number(id)


    try {
        await stat(DATA_FOLDER);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('No expenses found.');
            return;
        }
        throw err;
    }

    try {



        /* read existing data */
        const fileContent = await readFile(DATA_FILE, 'utf8');
        const expenses = JSON.parse(fileContent);
        const indexOfExpense = expenses.map(x => x.id).indexOf(id)

        if (indexOfExpense == -1) {
            console.log(`id ${id} not exist`);
            return
        }

        /* add new expense */
        const updatedData = JSON.stringify(
            expenses.toSpliced(indexOfExpense, 1),
            null,
            2
        );

        await writeFile(DATA_FILE, updatedData, 'utf8');
        console.log(`sucsses to delete expense whit id ${id}`);
    } catch (err) {
        console.log(err.message);
    }
}

/* UPDATE EXPENSE */
export async function updateItem(id, description, amount) {

    /* number verification */
    numberVerification(id, amount);
    id = Number(id)
    amount = Number(amount);

    try {
        await stat(DATA_FILE)
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('No expenses found.');
            return;
        }
        throw err;
    }

    try {

        /* read existing data */
        const fileContent = await readFile(DATA_FILE, 'utf8');
        const expenses = JSON.parse(fileContent);
        const indexOfExpense = expenses.map(x => x.id).indexOf(id)


        if (indexOfExpense == -1) {
            console.log(`id ${id} not exist`);
            return
        }


        /* add new expense */
        expenses[indexOfExpense].date = getCurrentDate();
        expenses[indexOfExpense].description = description;
        expenses[indexOfExpense].amount = amount;
        const updatedData = JSON.stringify(expenses, null, 2);


        await writeFile(DATA_FILE, updatedData, 'utf8');
        console.log(`sucsses to update expense whit id ${id}`);



    } catch (err) {
        console.log(err.message);
    }

}

/* SUMMARY EXPENSE */
export async function summary(month = "all") {


    try {
        await stat(DATA_FOLDER);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('No expenses found.');
            return;
        }
        throw err;
    }


    try {
        /* read file */
        const fileContent = await readFile(DATA_FILE, 'utf8');
        const expenses = JSON.parse(fileContent);

        const array_Month_And_Amount = expenses.map(x => {
            const [, month] = x.date.split("/");
            return { month: Number(month), amount: Number(x.amount) }
        });

        /* default sumarry (all)  */
        if (month == "all") {
            const allAmount = array_Month_And_Amount.reduce((sum, x) => sum + x.amount, 0);
            console.log(` total summary : ${allAmount}`);
            return;
        }

        /* especific summary (month)*/
        const filtered = array_Month_And_Amount.filter(
            x => x.month === Number(month)
        );

        if (filtered.length === 0) {
            console.log(`No expenses found for month ${month}`);
            return;
        }

        const totalByMonth = filtered.reduce((sum, x) => sum + x.amount, 0)
        console.log(` total summary on month ${month} : ${totalByMonth}`);



    } catch (err) {
        console.log(err.message);
    }
}

/* set budget */
export async function toCsv() {

    try {
        await stat(DATA_FOLDER);
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('No expenses found.');
            return;
        }
        throw err;
    }

    try {
        /* read file */
        const fileContent = await readFile(DATA_FILE, 'utf8');
        const expenses = JSON.parse(fileContent);

        /* edit file */
        const header = "id,data,description,amount"
        const rows = expenses.map(x => {
            return `${x.id},${x.date},"${x.description}",${x.amount}`
        })

        const result = [header, ...rows].join("\n");
        const date = new Date().toISOString().slice(0, 19).replace(/[:]/g, '-')
        const nameFile = `export-${date}.csv`
        const csvPath = path.join(DATA_FOLDER, nameFile);

        /* write file */
        await writeFile(csvPath, result, 'utf8');
        console.log("Successfully converted all expenses to CSV file");

    } catch (err) {
        console.log(err.message)
    }

}
