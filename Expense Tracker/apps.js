import { addItem, list, deleteItem, updateItem, summary, toCsv } from "./dataHandle.js";
import { Command } from "commander";

const program = new Command();

program
    .name('expense-tracker-cli')
    .version('0.0.0');

/* ADD */
program
    .command('add')
    .description("Add a new expense")
    .argument('<description>', 'Expense description')
    .argument('<amount>', 'Expense amount')
    .action(async (description, amount) => {
        try {
            await addItem(description, amount);
        } catch (err) {
            console.log(err.message);
            process.exit(1);
        }
    });

/* LIST */
program
    .command('list')
    .description("List all expenses")
    .action(() => {
        list();
    });

/* save to CSV file */
program
    .command('toCsv')
    .description("convert to csv file")
    .action(() => {
        toCsv();
    });


/* SUMMARY */
program
    .command('summary')
    .description("Show the total of all expenses or a specific month")
    .option('-m, --month <month>', 'Expense month')
    .action((options) => {
        summary(options.month);
    });

/* DELETE */
program
    .command('delete')
    .description("Delete an expense")
    .argument('<id>', 'Expense ID')
    .action(async (id) => {
        try {
            await deleteItem(id);
        } catch (err) {
            console.log(err.message);
            process.exit(1);
        }
    });

/* UPDATE */
program
    .command('update')
    .description("Update an expense")
    .argument('<id>', 'Expense ID')
    .argument('<description>', 'Expense description')
    .argument('<amount>', 'Expense amount')
    .action(async (id, description, amount) => {
        try {
            await updateItem(id, description, amount);
        } catch (err) {
            console.log(err.message);
            process.exit(1);
        }
    });

program.parse();
