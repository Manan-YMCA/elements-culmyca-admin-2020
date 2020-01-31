import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux"
import { actions } from "../core/reducers/sponsor"

import { serviceInstance } from "../core/utils/service"
import Table from '../component/Table'
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete"
import EditIcon from "@material-ui/icons/Edit"
import useSnackbar from "../hooks/useSnackbar"

export default function User() {
    const { data: { list, perPage, page, total }, loading, error } = useSelector((state) => state.sponsorReducer);
    useSnackbar(error)
    const [search, setSearch] = React.useState("");
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.getSponsor(serviceInstance.get(`/sponsor?perPage=${perPage}&page=${page}`)))
    }, [dispatch])
    const onPerPageChange = React.useCallback((perPage) => {
        dispatch(actions.getSponsor(serviceInstance.get(`/sponsor?perPage=${perPage}&page=${page}&search=${search}`)))
    }, [dispatch])
    const onPageChange = React.useCallback((page) => {
        dispatch(actions.getSponsor(serviceInstance.get(`/sponsor?perPage=${perPage}&page=${page}&search=${search}`)))
    }, [dispatch])
    const onSearchChange = React.useCallback((term) => {
        setSearch(term ? term : "");
        dispatch(actions.getSponsor(serviceInstance.get(`/sponsor?perPage=${perPage}&page=${page}&search=${term ? term : ""}`)))
    }, [dispatch])
    const onSearchClose = React.useCallback(() => {
        dispatch(actions.getSponsor(serviceInstance.get(`/sponsor?perPage=${10}&page=${0}`)))
    }, [dispatch])
    const renderAction = () => <><IconButton onClick={() => console.log("hello")}><DeleteIcon /></IconButton><IconButton><EditIcon /></IconButton></>
    return <><Table
        onSearchClose={onSearchClose}
        searchText={search}
        onSearchChange={onSearchChange}
        page={page}
        search={search}
        total={total}
        perPage={perPage}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
        loading={loading}
        title="Sponsors"
        columns={[
            { label: "Name", name: "name" },
            { label: "Type", name: "sponsorType" },
            { label: "Tag Line", name: "tagLine" },
            { label: "Logo", name: "logoUrl" },
            { label: "Id", name: "id" },
            { label: "Action", name: "action", options: { customBodyRender: renderAction } }
        ]}

        list={list}
    /></>
}