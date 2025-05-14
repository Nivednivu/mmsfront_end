import React from 'react';

function AdminDashboard() {
  const permitData = {
    lesseeName: "Gopal",
    lesseeAddress: "M.Gopal, C/o.E.Pandiyan, No.116, Agaram Village, Kadampathur Post, Tiruvallur (TK), District-631203",
    mineralName: "Gravel",
    bulkPermitNo: "TLR250000033",
    dispatchSlipNo: "DISP560505",
    deliveredTo: "BABU",
    vehicleNo: "TN20 CR7904",
    vehicleType: "Lorry",
    distance: "550 KM",
    destination: "CHENNAI",
    travelDate: "30-04-2025 08:44 AM",
    requiredTime: "10 hrs (30-04-2025 06:44 PM)",
    quantity: "18 M³",
    driverName: "GOPI",
    driverLicense: "4012",
    driverPhone: "9879743586",
    via: "THIRUVALLUR",
    leaseArea: {
      district: "Tiruvallur",
      taluk: "Tirutani",
      village: "Ramapuram",
      extent: "103/2A1A3, / 002.90.12",
      classification: "Patta Land",
      leasePeriod: "12-07-2024 to 11-12-2025"
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">Transport Permit Details</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <p><span className="font-semibold">Lessee Name:</span> {permitData.lesseeName}</p>
            <p><span className="font-semibold">Lessee Address:</span> {permitData.lesseeAddress}</p>
            <p><span className="font-semibold">Mineral Name:</span> {permitData.mineralName}</p>
            <p><span className="font-semibold">Bulk Permit No:</span> {permitData.bulkPermitNo}</p>
            <p><span className="font-semibold">Dispatch Slip No:</span> {permitData.dispatchSlipNo}</p>
            <p><span className="font-semibold">Delivered To:</span> {permitData.deliveredTo}</p>
            <p><span className="font-semibold">Vehicle No:</span> {permitData.vehicleNo}</p>
            <p><span className="font-semibold">Vehicle Type:</span> {permitData.vehicleType}</p>
            <p><span className="font-semibold">Total Distance:</span> {permitData.distance}</p>
          </div>

          <div>
            <p><span className="font-semibold">Destination:</span> {permitData.destination}</p>
            <p><span className="font-semibold">Travel Date:</span> {permitData.travelDate}</p>
            <p><span className="font-semibold">Required Time:</span> {permitData.requiredTime}</p>
            <p><span className="font-semibold">Quantity (in M³):</span> {permitData.quantity}</p>
            <p><span className="font-semibold">Driver Name:</span> {permitData.driverName}</p>
            <p><span className="font-semibold">Driver License No:</span> {permitData.driverLicense}</p>
            <p><span className="font-semibold">Driver Phone:</span> {permitData.driverPhone}</p>
            <p><span className="font-semibold">Via:</span> {permitData.via}</p>
          </div>
        </div>

        <hr className="my-6" />

        <h2 className="text-xl font-semibold mb-2 text-gray-800">Lease Area Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p><span className="font-semibold">District:</span> {permitData.leaseArea.district}</p>
          <p><span className="font-semibold">Taluk:</span> {permitData.leaseArea.taluk}</p>
          <p><span className="font-semibold">Village:</span> {permitData.leaseArea.village}</p>
          <p><span className="font-semibold">Extent:</span> {permitData.leaseArea.extent}</p>
          <p><span className="font-semibold">Classification:</span> {permitData.leaseArea.classification}</p>
          <p><span className="font-semibold">Lease Period:</span> {permitData.leaseArea.leasePeriod}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
