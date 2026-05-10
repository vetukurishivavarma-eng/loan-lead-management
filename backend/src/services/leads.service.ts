import { supabase } from '../config/supabase';
import XLSX from 'xlsx';

export interface RunningLoan {
  id?: string;
  sno: number | null;
  customer_name: string;
  lap: number | null;
  sme: number | null;
  hl: number | null;
  personal: number | null;
  edu_loan: number | null;
  bank_1: string | null;
  bank_2: string | null;
  bank_3: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CompletedLoan {
  id?: string;
  sno: number | null;
  customer_name: string;
  phone: string | null;
  loan_type: string | null;
  loan_amount: number | null;
  interest_rate: number | null;
  emi: number | null;
  month_label: string | null;
  created_at?: string;
  updated_at?: string;
}

export const getRunningLoans = async (): Promise<RunningLoan[]> => {
  console.log('Supabase URL:', process.env.SUPABASE_URL);
  const { data, error } = await supabase
    .from('running_loans')
    .select('*')
    .order('sno', { ascending: true });

  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  return data || [];
};

export const getCompletedLoans = async (): Promise<CompletedLoan[]> => {
  const { data, error } = await supabase
    .from('completed_loans')
    .select('*')
    .order('sno', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const addRunningLoan = async (loan: Omit<RunningLoan, 'id' | 'created_at' | 'updated_at'>): Promise<RunningLoan> => {
  const { data, error } = await supabase
    .from('running_loans')
    .insert([loan])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const addCompletedLoan = async (loan: Omit<CompletedLoan, 'id' | 'created_at' | 'updated_at'>): Promise<CompletedLoan> => {
  const { data, error } = await supabase
    .from('completed_loans')
    .insert([loan])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteRunningLoan = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('running_loans')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const deleteCompletedLoan = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('completed_loans')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export interface ExcelParseResult {
  runningCount: number;
  completedCount: number;
  monthLabel?: string;
}

export const processExcelUpload = async (file: Express.Multer.File): Promise<ExcelParseResult> => {
  const workbook = XLSX.read(file.buffer, { type: 'buffer' });

  let runningCount = 0;
  let completedCount = 0;
  let monthLabel: string | undefined;

  // Process RUNNING LOANS sheet
  if (workbook.SheetNames.includes('RUNNING LOANS')) {
    const sheet = workbook.Sheets['RUNNING LOANS'];
    const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const runningLoans: Omit<RunningLoan, 'id' | 'created_at' | 'updated_at'>[] = [];

    // Find header row (starts with "SNO" or "S No")
    let headerRowIndex = -1;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row && row.length > 0) {
        const firstCell = String(row[0]).toUpperCase();
        if (firstCell.includes('SNO') || firstCell.includes('S NO')) {
          headerRowIndex = i;
          break;
        }
      }
    }

    if (headerRowIndex >= 0) {
      // Parse data rows starting from after header
      for (let i = headerRowIndex + 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        const customerName = String(row[1] || '').trim();
        if (!customerName) continue;

        runningLoans.push({
          sno: row[0] ? Number(row[0]) || null : null,
          customer_name: customerName,
          lap: row[2] ? Number(row[2]) || null : null,
          sme: row[3] ? Number(row[3]) || null : null,
          hl: row[4] ? Number(row[4]) || null : null,
          personal: row[5] ? Number(row[5]) || null : null,
          edu_loan: row[6] ? Number(row[6]) || null : null,
          bank_1: row[7] ? String(row[7]).trim() : null,
          bank_2: row[8] ? String(row[8]).trim() : null,
          bank_3: row[9] ? String(row[9]).trim() : null,
        });
      }

      if (runningLoans.length > 0) {
        const { error } = await supabase.from('running_loans').insert(runningLoans);
        if (error) throw error;
        runningCount = runningLoans.length;
      }
    }
  }

  // Process COMPLETED LOANS sheet
  if (workbook.SheetNames.includes('COMPLETED LOANS')) {
    const sheet = workbook.Sheets['COMPLETED LOANS'];
    const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const completedLoans: Omit<CompletedLoan, 'id' | 'created_at' | 'updated_at'>[] = [];

    // Find header row
    let headerRowIndex = -1;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row && row.length > 0) {
        const firstCell = String(row[0]).toUpperCase();
        if (firstCell.includes('SNO') || firstCell.includes('S NO')) {
          headerRowIndex = i;
          break;
        }
      }
    }

    if (headerRowIndex >= 0) {
      // Parse month label from row 1 if available
      if (data.length > 0 && data[0]) {
        for (let col = 0; col < data[0].length; col++) {
          const cell = String(data[0][col] || '').toUpperCase();
          if (cell.match(/^(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)$/)) {
            monthLabel = data[0][col];
            break;
          }
        }
      }

      // Parse data rows
      for (let i = headerRowIndex + 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        const customerName = String(row[1] || '').trim();
        if (!customerName) continue;

        const loanAmount = row[4] ? Number(row[4]) || null : null;
        const interestRate = row[5] ? Number(row[5]) || null : null;

        let emi = row[6] ? Number(row[6]) || null : null;
        if (!emi && loanAmount && interestRate) {
          emi = loanAmount * interestRate;
        }

        completedLoans.push({
          sno: row[0] ? Number(row[0]) || null : null,
          customer_name: customerName,
          phone: row[2] ? String(row[2]).trim() : null,
          loan_type: row[3] ? String(row[3]).trim() : null,
          loan_amount: loanAmount,
          interest_rate: interestRate,
          emi: emi,
          month_label: monthLabel || null,
        });
      }

      if (completedLoans.length > 0) {
        const { error } = await supabase.from('completed_loans').insert(completedLoans);
        if (error) throw error;
        completedCount = completedLoans.length;
      }
    }
  }

  return { runningCount, completedCount, monthLabel };
};
