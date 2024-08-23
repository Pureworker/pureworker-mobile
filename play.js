const data = [
  {
    description: 'Hey people',
    images: [
      'file:///Users/admin/Library/Developer/CoreSimulator/Devices/DC1B4E28-0B87-45E8-98C7-4273ECA23E9B/data/Containers/Data/Application/0EC3E9FC-3C47-47E3-9A25-66AA49EB6FA2/tmp/27D54FCF-A30D-406D-8F56-1C9EB6ADC846.jpg',
      'file:///Users/admin/Library/Developer/CoreSimulator/Devices/DC1B4E28-0B87-45E8-98C7-4273ECA23E9B/data/Containers/Data/Application/0EC3E9FC-3C47-47E3-9A25-66AA49EB6FA2/tmp/0DB7E80E-B73D-4937-BFFE-ADF9C3F14699.jpg',
      'file:///Users/admin/Library/Developer/CoreSimulator/Devices/DC1B4E28-0B87-45E8-98C7-4273ECA23E9B/data/Containers/Data/Application/0EC3E9FC-3C47-47E3-9A25-66AA49EB6FA2/tmp/5E610D03-12BF-474F-BA2F-D8FF1AB6FE66.jpg',
    ],
    service: 'Office furniture assembly',
  },
  {
    description: 'Okay people',
    images: [
      'file:///Users/admin/Library/Developer/CoreSimulator/Devices/DC1B4E28-0B87-45E8-98C7-4273ECA23E9B/data/Containers/Data/Application/0EC3E9FC-3C47-47E3-9A25-66AA49EB6FA2/tmp/650ED171-D68D-479D-9295-72D35F532415.jpg',
      'file:///Users/admin/Library/Developer/CoreSimulator/Devices/DC1B4E28-0B87-45E8-98C7-4273ECA23E9B/data/Containers/Data/Application/0EC3E9FC-3C47-47E3-9A25-66AA49EB6FA2/tmp/D84C7883-5CA3-49C8-9BE6-7CB99DA3B81F.jpg',
      'file:///Users/admin/Library/Developer/CoreSimulator/Devices/DC1B4E28-0B87-45E8-98C7-4273ECA23E9B/data/Containers/Data/Application/0EC3E9FC-3C47-47E3-9A25-66AA49EB6FA2/tmp/3B4572B0-C251-4E2F-970E-2D5AC89D0CC4.jpg',
    ],
    service: 'Pet sitting and dog walking',
  },
];

const serviceList = [
  {
    __v: 0,
    _id: '64eb95cdd0ea85df8ffa4fac',
    label: 'Office furniture assembly',
    name: 'Office furniture assembly',
    value: 'Office furniture assembly',
  },
  {
    __v: 0,
    _id: '64eb95e7d0ea85df8ffa5024',
    label: 'Pet sitting and dog walking',
    name: 'Pet sitting and dog walking',
    value: 'Pet sitting and dog walking',
  },
];
const payload_data = data;
const payload_data2 = payload_data;
const payload_data1 = payload_data;

payload_data1?.map((item, index) => {
  const name = item.service;
  const filteredObject = serviceList?.filter(obj => obj?.label === name);
  console.log('here', filteredObject);
  payload_data2[index].service = filteredObject?._id;
});

console.log(payload_data2);
console.log('Welcome to Programiz!');
