import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux"

import { actions } from "../core/reducers/payment"

import { serviceInstance } from "../core/utils/service"
import Table from '../component/Table'
import useSnackbar from "../hooks/useSnackbar";

export default function User() {
    const { data: { list, perPage, page, total }, loading, error } = useSelector((state) => state.paymentReducer);
    useSnackbar(error);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.getPayment(serviceInstance.get(`/payments?perPage=${perPage}&page=${page}`)))
    }, [dispatch, page, perPage])
    const onPerPageChange = React.useCallback((perPage) => {
        dispatch(actions.getPayment(serviceInstance.get(`/payments?perPage=${perPage}&page=${page}`)))
    }, [dispatch, page])
    const onPageChange = React.useCallback((page) => {
        dispatch(actions.getPayment(serviceInstance.get(`/payments?perPage=${perPage}&page=${page}`)))
    }, [dispatch, perPage])
    const renderList = React.useMemo(() => {
        return list.map((val) => {
            const [sel, [event, club], col] = val
            return {
                collectedBy: col.fullName,
                event: event.title,
                organisedBy: club.name,
                value: sel.value
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
            title="Payments"
            columns={[
                { label: "Collected By", name: "collectedBy" },
                { label: "Event", name: "event" },
                { label: "Club", name: "organisedBy" },
                { label: "Amount", name: "value" }
            ]}
            list={renderList}
        /></>
}