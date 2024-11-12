import React from 'react'
import CrudTemplate from '../../../components/crud-template/CrudTemplate';

function WareHouseList() {
    const columns = [
        { title: "ID", dataIndex: "id", key: "id",align: "left", },
        { title: "Location", dataIndex: "location", key: "location",align: "left", },
        { title: "Max Capacity", dataIndex: "maxCapacity", key: "maxCapacity",align: "left", },
        { title: "Current Capacity", dataIndex: "currentCapacity", key: "currentCapacity",align: "left", },

    ];
  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
        <CrudTemplate columns={columns} path="sale/wareHouse/available"/>
    </div>
  )
}

export default WareHouseList