import React, { useState } from 'react';
import Papa from 'papaparse';
import { json2csv } from 'json-2-csv';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

function Index() {
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setHeaders(Object.keys(results.data[0]));
          setData(results.data);
        },
      });
    }
  };

  const handleCellChange = (rowIndex, column, value) => {
    const updatedData = [...data];
    updatedData[rowIndex][column] = value;
    setData(updatedData);
  };

  const handleAddRow = () => {
    const newRow = headers.reduce((acc, header) => ({ ...acc, [header]: '' }), {});
    setData([...data, newRow]);
  };

  const handleRemoveRow = (rowIndex) => {
    const updatedData = data.filter((_, index) => index !== rowIndex);
    setData(updatedData);
  };

  const handleDownload = () => {
    json2csv(data, (err, csv) => {
      if (err) {
        console.error('Error converting to CSV:', err);
        return;
      }
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'edited_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl text-center mb-4">CSV Upload, Edit, and Download Tool</h1>
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
      {data.length > 0 && (
        <>
          <Table className="mb-4">
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header}>{header}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={header}>
                      <Input
                        type="text"
                        value={row[header]}
                        onChange={(e) => handleCellChange(rowIndex, header, e.target.value)}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button variant="outline" onClick={() => handleRemoveRow(rowIndex)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button variant="outline" onClick={handleAddRow} className="mr-2">
            Add Row
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            Download CSV
          </Button>
        </>
      )}
    </div>
  );
}

export default Index;