
export type Member = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar: string;
  balance: number;
};

export type ExpenseSplit = {
  userId: string;
  amount: number;
  paid: boolean;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  date: string;
  settled: boolean;
  category: string;
  splits: ExpenseSplit[];
};

export type Group = {
  id: string;
  name: string;
  emoji: string;
  memberCount: number;
  balance: number;
  code: string;
  members: Member[];
  expenses: Expense[];
};

export type Settlement = {
  from: string;
  to: string;
  amount: number;
};