import React from "react";
import styled from "styled-components";

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
      <TD key={name}> {name}</TD>
      <TD key={price}> ${price}</TD>
      <TD key={quantity}> {quantity}</TD>
    </tr>
  );
};

const TD = styled.td`
  text-align: center;
  width: 40em;
`;
