import React, { useEffect, useState } from 'react';
import { Space, Switch, Table } from 'antd';
const columns = [
  {
    title: 'Rating score',
    dataIndex: 'ratingscore',
    key: 'ratingscore',
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment',
    width: '12%',
  },
];
const data = [
  {
    key: 1,
    name: 'John Brown sr.',
    age: 60,
    address: 'New York No. 1 Lake Park',
    children: [
      {
        key: 11,
        name: 'John Brown',
        age: 42,
        address: 'New York No. 2 Lake Park',
      },
      {
        key: 12,
        name: 'John Brown jr.',
        age: 30,
        address: 'New York No. 3 Lake Park',
        children: [
          {
            key: 121,
            name: 'Jimmy Brown',
            age: 16,
            address: 'New York No. 3 Lake Park',
          },
        ],
      },
      {
        key: 13,
        name: 'Jim Green sr.',
        age: 72,
        address: 'London No. 1 Lake Park',
        children: [
          {
            key: 131,
            name: 'Jim Green',
            age: 42,
            address: 'London No. 2 Lake Park',
            children: [
              {
                key: 1311,
                name: 'Jim Green jr.',
                age: 25,
                address: 'London No. 3 Lake Park',
              },
              {
                key: 1312,
                name: 'Jimmy Green sr.',
                age: 18,
                address: 'London No. 4 Lake Park',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    key: 2,
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
];

// rowSelection objects indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
  onSelectAll: (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  },
};
function ManageOrder() {
  const [checkStrictly, setCheckStrictly] = useState(false);
  const [feedbacks,setFeedBacks] = useState([]);
  const fetchFeedBack = async () => {
    // const response = await axios.get(api);
    try {
      const response = await axios.get(api);
      // const response = await api.get("manager");
      //lấy dữ liệu từ BE và set nó
      setFeedBacks(response.data);
    } catch (error) {
      toast.error(error.response.data);
    }
    //console.log(response.data);
  };
  useEffect(() => {
    // chạy sự kiện fetchUser
    fetchFeedBack();
  }, []);
  return (
    <>
      <Space
        align="center"
        style={{
          marginBottom: 16,
        }}
      >
        CheckStrictly: <Switch checked={checkStrictly} onChange={setCheckStrictly} />
      </Space>
      <Table
        columns={columns}
        rowSelection={{
          ...rowSelection,
          checkStrictly,
        }}
        dataSource={feedbacks}
      />
    </>
  );
}

export default ManageOrder