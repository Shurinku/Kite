import React, { useMemo } from "react";
import { useState, useEffect } from "react";
import { AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import { BsArrowDownUp } from "react-icons/bs";
import axios from "axios";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";
import Search from "./Search";

export default function Table() {
  const [spots, setSpots] = useState([]);
  const getSpots = async () => {
    const response = await axios
      .get("https://62543bbd89f28cf72b5a6911.mockapi.io/spot")
      .catch((err) => console.log(err));
    if (response) {
      const spots = response.data;
      setSpots(spots);
    }
  };
  const data = [];
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Country",
        accessor: "country",
      },
      {
        Header: "Lattitude",
        accessor: "lat",
      },
      {
        Header: "Longitude",
        accessor: "long",
      },
      {
        Header: "Wind.Prob.",
        accessor: "probability",
      },
      {
        Header: "When to go",
        accessor: "month",
      },
    ],
    []
  );
  const spotsData = React.useMemo(() => [...spots], [spots]);
  const tableInstance = useTable(
    { columns, data: spotsData },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    prepareRow,
    setGlobalFilter,
    state,
  } = tableInstance;
  const { pageIndex } = state;
  const isEven = (idx) => idx % 2 === 0;
  useEffect(() => {
    getSpots();
  }, []);
  return (
    <div className="mainTable">
      <Search
        setGlobalFilter={setGlobalFilter}
        globalFilter={state.globalFilter}
      />
      <table {...getTableProps()} className="table">
        <thead className="mainThead">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <BsArrowDownUp className="arrows"></BsArrowDownUp>
                    ) : (
                      <BsArrowDownUp className="arrows" />
                    )
                  ) : (
                    <BsArrowDownUp className="arrows" />
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row, idx) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={isEven(idx) ? "evenRow" : ""}
              >
                {row.cells.map((cell, idx) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pageChange">
        <button
          className="pageBtn"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <AiOutlineArrowLeft />
        </button>
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>
        </span>
        <button
          className="pageBtn"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <AiOutlineArrowRight></AiOutlineArrowRight>
        </button>
      </div>
    </div>
  );
}
