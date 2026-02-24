"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Calendar, DollarSign, Tag, Home, Check, X, Clock, Trash2 } from "lucide-react";

const UserRow = ({ user, onApprovalChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleApproval = async (bookingId, status) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status }),
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        alert(`Failed to update booking status: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();
      alert(data.message || "Booking status updated successfully");
      
      // Refresh the data
      if (onApprovalChange) onApprovalChange();
    } catch (error) {
      console.error("Error updating booking:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookingId) => {
    if (loading) return;
    
    if (!confirm("Are you sure you want to delete this booking? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users?bookingId=${bookingId}`, {
        method: "DELETE",
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        alert(`Failed to delete booking: ${response.status} ${response.statusText}`);
        return;
      }

      const data = await response.json();
      alert(data.message || "Booking deleted successfully");
      
      // Refresh the data
      if (onApprovalChange) onApprovalChange();
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert(`An error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      approved: { bg: "bg-green-100", text: "text-green-700", icon: Check, label: "Approved" },
      rejected: { bg: "bg-red-100", text: "text-red-700", icon: X, label: "Rejected" },
      pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: Clock, label: "Pending" },
    };
    
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 ${badge.bg} ${badge.text} rounded-full text-xs font-medium`}>
        <Icon className="w-3 h-3" />
        {badge.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* User Header - Clickable */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {user.bookings?.length || 0} {user.bookings?.length === 1 ? 'Booking' : 'Bookings'}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Bookings Section */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          {!user.bookings || user.bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Home className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No bookings found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {user.bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex flex-col gap-3">
                    {/* Header with Product Name and Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <Home className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-gray-900">{booking.productName || "N/A"}</p>
                          {booking.resortRoom?._id && (
                            <p className="text-xs text-gray-500 mt-0.5">Room ID: {booking.resortRoom._id}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(booking.status)}
                        <button
                          onClick={() => handleDelete(booking._id)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Price</p>
                          <p className="font-semibold text-gray-900">₹{booking.price || 0}</p>
                        </div>
                      </div>

                      {/* Offer */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <Tag className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Offer</p>
                          <p className="font-semibold text-gray-900">{booking.offer || "None"}</p>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Duration</p>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.startDate && booking.endDate ? (
                              <>
                                {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </>
                            ) : (
                              "N/A"
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Approval Buttons */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleApproval(booking._id, "approved")}
                        disabled={loading || booking.status === "approved"}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Check className="w-4 h-4" />
                        {booking.status === "approved" ? "Approved" : "Approve"}
                      </button>
                      <button
                        onClick={() => handleApproval(booking._id, "rejected")}
                        disabled={loading || booking.status === "rejected"}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                        {booking.status === "rejected" ? "Rejected" : "Reject"}
                      </button>
                      {(booking.status === "approved" || booking.status === "rejected") && (
                        <button
                          onClick={() => handleApproval(booking._id, "pending")}
                          disabled={loading}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Clock className="w-4 h-4" />
                          Reset to Pending
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const UsersClient = ({ users: initialUsers }) => {
  const [users, setUsers] = useState(initialUsers);

  const refreshUsers = async () => {
    try {
      window.location.reload();
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Button */}
        <div className="mb-4">
          <a
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Admin Dashboard
          </a>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">View and manage user bookings</p>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">{users?.length || 0}</span> Total Users
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold text-gray-900">
                {users?.reduce((sum, user) => sum + (user.bookings?.length || 0), 0) || 0}
              </span> Total Bookings
            </span>
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-3">
          {!users || users.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No users found</p>
            </div>
          ) : (
            users.map((user) => <UserRow key={user._id} user={user} onApprovalChange={refreshUsers} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersClient;













































// "use client";

// import { useState } from "react";
// import { ChevronDown, ChevronRight, Calendar, DollarSign, Tag, Home } from "lucide-react";

// const UserRow = ({ user }) => {
//   const [isExpanded, setIsExpanded] = useState(false);

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 overflow-hidden transition-all duration-200 hover:shadow-md">
//       {/* User Header - Clickable */}
//       <button
//         onClick={() => setIsExpanded(!isExpanded)}
//         className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
//       >
//         <div className="flex items-center gap-4 flex-1">
//           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
//             {user.name?.charAt(0).toUpperCase() || "U"}
//           </div>
//           <div className="text-left">
//             <h3 className="font-semibold text-gray-900">{user.name}</h3>
//             <p className="text-sm text-gray-500">{user.email}</p>
//           </div>
//         </div>
        
//         <div className="flex items-center gap-4">
//           <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
//             {user.bookings?.length || 0} {user.bookings?.length === 1 ? 'Booking' : 'Bookings'}
//           </span>
//           {isExpanded ? (
//             <ChevronDown className="w-5 h-5 text-gray-400" />
//           ) : (
//             <ChevronRight className="w-5 h-5 text-gray-400" />
//           )}
//         </div>
//       </button>

//       {/* Expanded Bookings Section */}
//       {isExpanded && (
//         <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
//           {!user.bookings || user.bookings.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <Home className="w-12 h-12 mx-auto mb-2 opacity-50" />
//               <p>No bookings found</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {user.bookings.map((booking) => (
//                 <div
//                   key={booking._id}
//                   className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
//                 >
//                   <div className="flex flex-col gap-3">
//                     {/* Product Name */}
//                     <div className="flex items-start gap-2">
//                       <Home className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
//                       <div>
//                         <p className="font-semibold text-gray-900">{booking.productName || "N/A"}</p>
//                         {booking.resortRoom?._id && (
//                           <p className="text-xs text-gray-500 mt-0.5">Room ID: {booking.resortRoom._id}</p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Details Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
//                       {/* Price */}
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
//                           <DollarSign className="w-4 h-4 text-green-600" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500">Price</p>
//                           <p className="font-semibold text-gray-900">₹{booking.price || 0}</p>
//                         </div>
//                       </div>

//                       {/* Offer */}
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
//                           <Tag className="w-4 h-4 text-purple-600" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500">Offer</p>
//                           <p className="font-semibold text-gray-900">{booking.offer || "None"}</p>
//                         </div>
//                       </div>

//                       {/* Dates */}
//                       <div className="flex items-center gap-2">
//                         <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
//                           <Calendar className="w-4 h-4 text-blue-600" />
//                         </div>
//                         <div>
//                           <p className="text-xs text-gray-500">Duration</p>
//                           <p className="text-sm font-medium text-gray-900">
//                             {booking.startDate && booking.endDate ? (
//                               <>
//                                 {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                               </>
//                             ) : (
//                               "N/A"
//                             )}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// const UsersClient = ({ users }) => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         {/* Navigation Button */}
//         <div className="mb-4">
//           <a
//             href="/admin"
//             className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//             </svg>
//             Back to Admin Dashboard
//           </a>
//         </div>

//         {/* Header */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
//           <p className="text-gray-600">View and manage user bookings</p>
//           <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
//             <span className="flex items-center gap-1">
//               <span className="font-semibold text-gray-900">{users?.length || 0}</span> Total Users
//             </span>
//             <span className="flex items-center gap-1">
//               <span className="font-semibold text-gray-900">
//                 {users?.reduce((sum, user) => sum + (user.bookings?.length || 0), 0) || 0}
//               </span> Total Bookings
//             </span>
//           </div>
//         </div>

//         {/* Users List */}
//         <div className="space-y-3">
//           {!users || users.length === 0 ? (
//             <div className="bg-white rounded-lg shadow-md p-12 text-center">
//               <p className="text-gray-500 text-lg">No users found</p>
//             </div>
//           ) : (
//             users.map((user) => <UserRow key={user._id} user={user} />)
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UsersClient;





// // "use client";

// // import { useState } from "react";
// // import { ChevronDown, ChevronRight, Calendar, DollarSign, Tag, Home } from "lucide-react";

// // const UserRow = ({ user }) => {
// //   const [isExpanded, setIsExpanded] = useState(false);

// //   return (
// //     <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3 overflow-hidden transition-all duration-200 hover:shadow-md">
// //       {/* User Header - Clickable */}
// //       <button
// //         onClick={() => setIsExpanded(!isExpanded)}
// //         className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
// //       >
// //         <div className="flex items-center gap-4 flex-1">
// //           <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
// //             {user.name?.charAt(0).toUpperCase() || "U"}
// //           </div>
// //           <div className="text-left">
// //             <h3 className="font-semibold text-gray-900">{user.name}</h3>
// //             <p className="text-sm text-gray-500">{user.email}</p>
// //           </div>
// //         </div>
        
// //         <div className="flex items-center gap-4">
// //           <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
// //             {user.bookings?.length || 0} {user.bookings?.length === 1 ? 'Booking' : 'Bookings'}
// //           </span>
// //           {isExpanded ? (
// //             <ChevronDown className="w-5 h-5 text-gray-400" />
// //           ) : (
// //             <ChevronRight className="w-5 h-5 text-gray-400" />
// //           )}
// //         </div>
// //       </button>

// //       {/* Expanded Bookings Section */}
// //       {isExpanded && (
// //         <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
// //           {!user.bookings || user.bookings.length === 0 ? (
// //             <div className="text-center py-8 text-gray-500">
// //               <Home className="w-12 h-12 mx-auto mb-2 opacity-50" />
// //               <p>No bookings found</p>
// //             </div>
// //           ) : (
// //             <div className="space-y-3">
// //               {user.bookings.map((booking) => (
// //                 <div
// //                   key={booking._id}
// //                   className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
// //                 >
// //                   <div className="flex flex-col gap-3">
// //                     {/* Product Name */}
// //                     <div className="flex items-start gap-2">
// //                       <Home className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
// //                       <div>
// //                         <p className="font-semibold text-gray-900">{booking.productName || "N/A"}</p>
// //                         {booking.resortRoom?._id && (
// //                           <p className="text-xs text-gray-500 mt-0.5">Room ID: {booking.resortRoom._id}</p>
// //                         )}
// //                       </div>
// //                     </div>

// //                     {/* Details Grid */}
// //                     <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-gray-100">
// //                       {/* Price */}
// //                       <div className="flex items-center gap-2">
// //                         <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
// //                           <DollarSign className="w-4 h-4 text-green-600" />
// //                         </div>
// //                         <div>
// //                           <p className="text-xs text-gray-500">Price</p>
// //                           <p className="font-semibold text-gray-900">₹{booking.price || 0}</p>
// //                         </div>
// //                       </div>

// //                       {/* Offer */}
// //                       <div className="flex items-center gap-2">
// //                         <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
// //                           <Tag className="w-4 h-4 text-purple-600" />
// //                         </div>
// //                         <div>
// //                           <p className="text-xs text-gray-500">Offer</p>
// //                           <p className="font-semibold text-gray-900">{booking.offer || "None"}</p>
// //                         </div>
// //                       </div>

// //                       {/* Dates */}
// //                       <div className="flex items-center gap-2">
// //                         <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
// //                           <Calendar className="w-4 h-4 text-blue-600" />
// //                         </div>
// //                         <div>
// //                           <p className="text-xs text-gray-500">Duration</p>
// //                           <p className="text-sm font-medium text-gray-900">
// //                             {booking.startDate && booking.endDate ? (
// //                               <>
// //                                 {new Date(booking.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(booking.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
// //                               </>
// //                             ) : (
// //                               "N/A"
// //                             )}
// //                           </p>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // const UsersClient = ({ users }) => {
// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
// //       <div className="max-w-6xl mx-auto">
// //         {/* Header */}
// //         <div className="bg-white rounded-xl shadow-md p-6 mb-6">
// //           <h1 className="text-3xl font-bold text-gray-900 mb-2">User Management</h1>
// //           <p className="text-gray-600">View and manage user bookings</p>
// //           <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
// //             <span className="flex items-center gap-1">
// //               <span className="font-semibold text-gray-900">{users?.length || 0}</span> Total Users
// //             </span>
// //             <span className="flex items-center gap-1">
// //               <span className="font-semibold text-gray-900">
// //                 {users?.reduce((sum, user) => sum + (user.bookings?.length || 0), 0) || 0}
// //               </span> Total Bookings
// //             </span>
// //           </div>
// //         </div>

// //         {/* Users List */}
// //         <div className="space-y-3">
// //           {!users || users.length === 0 ? (
// //             <div className="bg-white rounded-lg shadow-md p-12 text-center">
// //               <p className="text-gray-500 text-lg">No users found</p>
// //             </div>
// //           ) : (
// //             users.map((user) => <UserRow key={user._id} user={user} />)
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default UsersClient;