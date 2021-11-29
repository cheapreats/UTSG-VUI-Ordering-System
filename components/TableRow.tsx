import React from "react";

interface TableRowProps {
  name: string;
  price: number;
  quantity: number;
}

export const TableRow: React.VFC<TableRowProps> = ({
  name,
  price,
  quantity,
}) => {
  return (
    <tr>
      <td id={name}> {name}</td>
      <td id={name}> {price}</td>
      <td id={name}> {quantity}</td>
    </tr>
  );
};
