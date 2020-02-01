import React from 'react';
import MaterialTable from "mui-datatables";

import { LinearProgress, Button } from "@material-ui/core";

export default function Table({ columns, title, onSearchClose, onSearchChange, page, total, perPage, onPageChange, onPerPageChange, loading, list, search, extra = "" }) {
    return <MaterialTable
        options={
            {
                selectableRows: "none",
                rowsPerPageOptions: [5, 10, 20, 100],
                onSearchClose,
                searchText: search,
                serverSide: true,
                onSearchChange,
                page,
                count: total,
                rowsPerPage: perPage,
                onChangePage: onPageChange,
                onChangeRowsPerPage: onPerPageChange,
                customToolbar: loading ? () => <LinearProgress style={{
                    width: '100%',
                    height: 4,
                    left: 0,
                    top: 0,
                    position: 'absolute',
                }
                } /> : extra
            }
        }
        title={title}
        columns={columns}
        data={list}
    />
}