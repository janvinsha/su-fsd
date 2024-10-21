// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

type Record = {
  createdAt: string;
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Record[] | { message: string }>
) {
  const sortBy = req.query.sortBy as string | undefined;
  const csvFilePath = path.join(process.cwd(), 'public', 'files', 'data.csv');
  const fileContent = fs.readFileSync(csvFilePath, 'utf-8');

  parse(fileContent, { columns: false }, (err, records: string[][]) => {
    if (err) {
      res.status(500).json({ message: "Error trying to get CSV" });
      return;
    }
    const _records: Record[] = records.map((record: string[]) => ({
      createdAt: record[0]?.split(';')[0],
      name: record[0]?.split(';')[1]
    }));

    // Sort based on query param
    if (sortBy === "createdAt") {
      _records.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (sortBy === "asc") {
      _records.sort((a, b) => compareWithNumbers(a.name, b.name));
    } else if (sortBy === "desc") {
      _records.sort((a, b) => compareWithNumbers(b.name, a.name));
    }

    res.status(200).json(_records);
  });
}

function compareWithNumbers(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}
