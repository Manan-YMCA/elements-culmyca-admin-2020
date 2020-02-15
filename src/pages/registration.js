import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux"
import SmileIcons from "@material-ui/icons/VerifiedUser"
import CrossIcons from "@material-ui/icons/Cancel"

import { actions } from "../core/reducers/registration"

import { serviceInstance } from "../core/utils/service"
import Table from '../component/Table'
import useSnackbar from "../hooks/useSnackbar";

export default function User() {
    const { data: { list, perPage, page, total }, loading, error } = useSelector((state) => state.registrationReducer);
    useSnackbar(error);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(actions.getRegistration(serviceInstance.get(`/registration?perPage=${perPage}&page=${page}`)))
    }, [dispatch, page, perPage])
    const onPerPageChange = React.useCallback((perPage) => {
        dispatch(actions.getRegistration(serviceInstance.get(`/registration?perPage=${perPage}&page=${page}`)))
    }, [dispatch, page])
    const onPageChange = React.useCallback((page) => {
        dispatch(actions.getRegistration(serviceInstance.get(`/registration?perPage=${perPage}&page=${page}`)))
    }, [dispatch, perPage])
    const renderYesNo = (val) => <div style={{ textAlign: "center" }}>{val ? <SmileIcons /> : <CrossIcons />}</div>
    const renderList = React.useMemo(() => {
        return list.map((val) => {
            const [sel, [event, club], user] = val
            return {
                name: user.fullName,
                contact: `${user.phone}-${user.email}`,
                event: event.title,
                organisedBy: club.name,
                attended: sel.attended
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
            title="Registrations"
            columns={[
                { label: "User Name", name: "name" },
                { label: "Contact", name: "contact" },
                { label: "Club", name: "organisedBy" },
                { label: "Event", name: "event" },
                { label: "Attended", name: "attended", options: { customBodyRender: renderYesNo } }
            ]}
            list={renderList}
        /></>
}