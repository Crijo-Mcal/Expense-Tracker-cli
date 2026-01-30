
/* HELPERS */
export function generateNextId(expenses) {
    const ids = expenses.map(item => item.id);

    return expenses.length == 0 ? 1 : Math.max(...ids) + 1;


}

export function formatExpense(description, amount, id) {
    return {
        id,
        date: getCurrentDate(),
        description,
        amount
    };
}

export function printTable(expenses) {

    console.log(
        "# ID".padEnd(10) +
        "Date".padEnd(15) +
        "Description".padEnd(30) +
        "Amount (€)".padStart(10)
    );

    for (const expense of expenses) {
        console.log(
            String(`# ${expense.id}`).padEnd(10) +
            expense.date.padEnd(15) +
            expense.description.padEnd(30) +
            String(expense.amount).padStart(10)
        );
    }
}

export function getCurrentDate() {
    const date = new Date();
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
}

export function numberVerification(id, amount) {

    if (id !== undefined && isNaN(id)) {
        throw new Error(`id  must be a number`)
    }

    if (amount !== undefined && isNaN(amount)) {
        throw new Error(`amount must be a number`)
    }


}



