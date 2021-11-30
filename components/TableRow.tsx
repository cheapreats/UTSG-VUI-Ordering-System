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
      <td key={name}> {name}</td>
      <td key={price}> {price}</td>
      <td key={quantity}> {quantity}</td>
    </tr>
  );
};
