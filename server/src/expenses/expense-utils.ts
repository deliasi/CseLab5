import { Request, Response } from "express";
import { Database } from 'sqlite';

// Function to create a new expense in the database
export async function createExpenseServer(req: Request, res: Response, db: Database) {
    const { id, cost, description } = req.body;
 
    if (!description || !id || !cost) {
        return res.status(400).send({ error: "Missing required fields" });
    }
 
    try {
        // Check if the ID already exists
        const existingExpense = await db.get('SELECT * FROM expenses WHERE id = ?', [id]);
        if (existingExpense) {
            return res.status(409).send({ error: `Expense with ID ${id} already exists` }); // 409 Conflict
        }

        // Insert the new expense
        await db.run('INSERT INTO expenses (id, description, cost) VALUES (?, ?, ?);', [id, description, cost]);
        res.status(201).send({ id, description, cost });
    } catch (error) {
        return res.status(400).send({ error: `Expense could not be created: ${error}` });
    }
}


// Function to delete an expense from the database
export async function deleteExpense(req: Request, res: Response, db: Database) {
    const { id } = req.params; // Extract the ID from the request parameters

    try {
        // Check if the expense with the given ID exists
        const expense = await db.get('SELECT * FROM expenses WHERE id = ?', [id]);

        if (!expense) {
            // If not found, send a 404 response
            return res.status(404).send({ error: "Expense not found" });
        }

        // Delete the expense if it exists
        await db.run('DELETE FROM expenses WHERE id = ?', [id]);
        res.status(200).send({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete expense', details: error });
    }
}

// Function to get all expenses from the database
export async function getExpenses(req: Request, res: Response, db: Database) {
    try {
        // Fetch all rows from the 'expenses' table
        const rows = await db.all('SELECT * FROM expenses');
        res.status(200).send({ data: rows });
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve expenses', details: error });
    }
}

 
