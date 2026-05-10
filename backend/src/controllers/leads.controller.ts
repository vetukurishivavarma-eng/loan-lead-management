import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import * as leadsService from '../services/leads.service';

export const getRunningLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('Controller: Starting getRunningLoans');
    const loans = await leadsService.getRunningLoans();
    console.log('Controller: Got loans:', loans.length);
    res.json(loans);
  } catch (error: any) {
    console.error('Controller Error fetching running loans:', error);
    res.status(500).json({ error: 'Failed to fetch running loans', details: error?.message });
  }
};

export const getCompletedLoans = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loans = await leadsService.getCompletedLoans();
    res.json(loans);
  } catch (error) {
    console.error('Error fetching completed loans:', error);
    res.status(500).json({ error: 'Failed to fetch completed loans' });
  }
};

export const addRunningLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loan = req.body;
    const result = await leadsService.addRunningLoan(loan);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding running loan:', error);
    res.status(500).json({ error: 'Failed to add running loan' });
  }
};

export const addCompletedLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const loan = req.body;
    const result = await leadsService.addCompletedLoan(loan);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding completed loan:', error);
    res.status(500).json({ error: 'Failed to add completed loan' });
  }
};

export const deleteRunningLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await leadsService.deleteRunningLoan(id);
    res.json({ message: 'Running loan deleted successfully' });
  } catch (error) {
    console.error('Error deleting running loan:', error);
    res.status(500).json({ error: 'Failed to delete running loan' });
  }
};

export const deleteCompletedLoan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await leadsService.deleteCompletedLoan(id);
    res.json({ message: 'Completed loan deleted successfully' });
  } catch (error) {
    console.error('Error deleting completed loan:', error);
    res.status(500).json({ error: 'Failed to delete completed loan' });
  }
};

export const uploadExcel = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const result = await leadsService.processExcelUpload(req.file);
    res.json({
      message: 'Excel file processed successfully',
      runningLoansImported: result.runningCount,
      completedLoansImported: result.completedCount,
      monthLabel: result.monthLabel
    });
  } catch (error) {
    console.error('Error processing Excel file:', error);
    res.status(500).json({ error: 'Failed to process Excel file' });
  }
};
