import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux"

import { actions } from "../core/reducers/event"

import { serviceInstance } from "../core/utils/service"
import Table from '../component/Table'
import useSnackbar from "../hooks/useSnackbar";

export default function User() {
    const { data: { list, perPage, page, total }, loading, error } = useSelector((state) => state.eventReducer);
    useSnackbar(error);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.getEvents(serviceInstance.get(`/event?perPage=${perPage}&page=${page}`)))
    }, [dispatch, page, perPage])
    const onPerPageChange = React.useCallback((perPage) => {
        dispatch(actions.getEvents(serviceInstance.get(`/event?perPage=${perPage}&page=${page}`)))
    }, [dispatch, page])
    const onPageChange = React.useCallback((page) => {
        dispatch(actions.getEvents(serviceInstance.get(`/event?perPage=${perPage}&page=${page}`)))
    }, [dispatch, perPage])
    const renderList = React.useMemo(() => {
        return list.map((val) => {
            const [sel, org, club] = val
            return {
                event: sel.title,
                fee: sel.fee,
                organisedBy: club.name,
                value: sel.value,
                date: sel.eventTime,
                contact: `${org.fullName}-(${org.phone})`
            }
        })
    }, [list])
    return <>
        <Table
            page={page}
            total={total}
            perPage={perPage}
            onPageChange={onPageChange}
            onPerPageChange={onPerPageChange}
            loading={loading}
            title="Events"
            columns={[
                { label: "Event", name: "event" },
                { label: "Club", name: "organisedBy" },
                { label: "Amount", name: "fee" },
                { label: "Date", name: "event" },
                { lable: "Contact", name: "contact" }
            ]}
            list={renderList}
        /></>
}