// Copyright (c) 2025, Dux_Digitech and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Personal Details", {
// 	refresh(frm) {

// 	},
// });

// personal details 

// Cascading of Cluster at village
// frappe.ui.form.on('Personal Details', {
//     display_name: function(frm) {
//         // Clear component field when town is changed
//         frm.set_value('cluster_name', '');
// console.log(cluster_name)
//         // Filter component based on selected town
//         frm.set_query('cluster_name', function() {
//             return {
//                 filters: {
//                     display_name: frm.doc.display_name // assumes 'town' is the Link field in 'Component At Town'
//                 },
// frappe.ui.form.on('Personal Details', {
//     display_name: function(frm) {
//         // Clear component field when site is changed
//         frm.set_value('cluster_name', '');

//         // Filter cluster_name based on selected site
//         frm.set_query('cluster_name', function() {
//             return {
//                 filters: {
//                     display_name: frm.doc.display_name
//                 }
//             };
//         });
//     }
// });



// // Cluster at block

// frappe.ui.form.on('Personal Details', {
//     display_name: function(frm) {
//         // Clear component field when town is changed
//         frm.set_value('village_name', '');

//         // Filter component based on selected town
//         frm.set_query('village_name', function() {
//             return {
//                 filters: {
//                     display_name: frm.doc.display_name // assumes 'town' is the Link field in 'Component At Town'
//                 }
//             };
//         });
//     }
// });
                
//             };
//         });
//     }
// });



frappe.ui.form.on('Personal Details', {
    display_name: function(frm) {
        
        frm.set_value('cluster_name', '');

       
        frm.set_query('cluster_name', function() {
            return {
                filters: {
                    display_name: frm.doc.display_name
                }
            };
        });
    }
});



// Cluster at block

frappe.ui.form.on('Personal Details', {
    display_name: function(frm) {
        // Clear component field when town is changed
        frm.set_value('village_name', '');

        // Filter component based on selected town
        frm.set_query('village_name', function() {
            return {
                filters: {
                    cluster_name: frm.doc.cluster_name // assumes 'town' is the Link field in 'Component At Town'
                }
            };
        });
    }
});

// Latitude and Longitude

frappe.ui.form.on('Personal Details', {
    refresh(frm) {
        // Only for new record
        if (!frm.is_new()) return;

        // Prevent duplicate button
        if (frm.location_button_added) return;

        // Find latitude field wrapper
        const lat_wrapper = frm.fields_dict.latitude.$wrapper;

        // Create a small, clean inline button
        const btn = $(`
            <button type="button" class="btn btn-secondary btn-xs" style="margin-left:6px; font-size:11px; padding:2px 6px;">
                📍 Get Location
            </button>
        `);

        // Put the button right beside the latitude field
        lat_wrapper.find('.control-input').css({
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
        }).append(btn);

        // Button click handler
        btn.on('click', function () {
            btn.text('⏳ Capturing...').prop('disabled', true);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (pos) {
                        const lat = pos.coords.latitude.toFixed(6);
                        const lng = pos.coords.longitude.toFixed(6);

                        frm.set_value('latitude', lat);
                        frm.set_value('longitude', lng);
                        frm.refresh_field('latitude');
                        frm.refresh_field('longitude');

                        btn.text('✅ Captured');
                        setTimeout(() => btn.text('📍 Update Location').prop('disabled', false), 1000);
                    },
                    function () {
                        btn.text('📍 Get Location').prop('disabled', false);
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            } else {
                btn.text('🌐 Not Supported').prop('disabled', false);
            }
        });

        frm.location_button_added = true;
    }
});



// frappe.ui.form.on('Personal Details', {
//     onload: function(frm) {
//         // Run only for new documents and if latitude/longitude are empty
//         if (frm.is_new() && (!frm.doc.latitude || !frm.doc.longitude)) {
//             if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(
//                     function(position) {
//                         let lat = position.coords.latitude;
//                         let lng = position.coords.longitude;

//                         // Set values only once
//                         frm.set_value('latitude', lat);
//                         frm.set_value('longitude', lng);

//                         frappe.msgprint(`Location captured: ${lat}, ${lng}`);
//                     },
//                     function(error) {
//                         if (error.code === error.PERMISSION_DENIED) {
//                             frappe.msgprint("Location permission denied. Please allow it in browser settings.");
//                         } else {
//                             frappe.msgprint("Error getting location: " + error.message);
//                         }
//                     }
//                 );
//             } else {
//                 frappe.msgprint("Geolocation is not supported by this browser.");
//             }
//         }
//     }
// });


// Capitalize Name 
frappe.ui.form.on('Personal Details', {
    customer_name: function(frm) {
        // Capitalize customer name
        let customer_name = frm.doc.customer_name;
        frm.set_value('customer_name', capitalizeWords(customer_name));
    },
    
    address: function(frm) {
        // Capitalize address
        let address = frm.doc.address;
        frm.set_value('address', capitalizeWords(address));
    }
});

// Helper function to capitalize words
function capitalizeWords(str) {
    if (!str) return str;
    return str.replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
}
 

// HSC Master Status

frappe.ui.form.on("Personal Detail", {
    before_save: function(frm) {
        if (!frm.doc.Connection_status) {
            frm.set_value("Connection_status", "New");
        }
    }
});


// HSC Add details on display name

frappe.ui.form.on("Personal Details", {
    customer_name(frm) {
        set_display_name(frm);
     }
    // display_name(frm) {
    //     set_display_name(frm);
    // },
    // cluster_name(frm) {
    //     set_display_name(frm);
    //  },    
    // mobile_number(frm) {
    //     set_display_name(frm);
    // },
    //   aadhar_number(frm) {
    //     set_display_name(frm);
    // },
    //   types_of_connection(frm) {
    //     set_display_name(frm);
    // }
    
});

function set_display_name(frm) {
    const parts = [
        frm.doc.customer_name
        // frm.doc.display_name,
        //  frm.doc.cluster_name,
        // frm.doc.mobile_number,
        // frm.doc.aadhar_number,
        // frm.doc.types_of_connection
    ]
    .filter(Boolean)
    .map(v => String(v).trim());

    const value = parts.join(" - "); // e.g., "Customer - Town - Mobile - Address"

    if (frm.doc.display_name !== value) {
        frm.set_value("all_details", value || "");
    }
}


// Personal Detail Against HSC

// frappe.ui.form.on('Personal Details', {
//     refresh: function(frm) {
//         if (!frm.is_new()) {
//             frm.add_custom_button(__('Create HSC Detail'), function() {
//                 frappe.db.exists('HSC Details', { personal_detail: frm.doc.name })
//                     .then(exists => {
//                         if (exists) {
//                             // Agar already HSC bana hai, usko open karo
//                             frappe.set_route('Form', 'HSC Details', exists);
//                         } else {
//                             // Agar nahi hai, naya HSC banao
//                             frappe.new_doc('HSC Details', {
//                                 personal_detail: frm.doc.name,
//                                 townproject: frm.doc.townproject,
//                                 contractor: frm.doc.contractor,
//                                 supervisor: frm.doc.supervisor
//                             });
//                         }
//                     });
//             }, __('Create'));  // "Create" group ke andar button ayega
//         }
//     }
// });

// Contractor By Cluster 

frappe.ui.form.on('Personal Details', {
    cluster_name: function(frm) {
        
        frm.set_value('contractor_name', '');

        
        frm.set_query('contractor_name', function() {
            return {
                filters: {
                    cluster_name: frm.doc.cluster_name  
                }
            };
        });
    }
});




// Staff at Cluster

frappe.ui.form.on('Personal Details', {
    cluster_name: function(frm) {
        // Clear component field when town is changed
        frm.set_value('staff_name', '');

        // Filter contractor_name based on selected town
        frm.set_query('staff_name', function() {
            return {
                filters: {
                    cluster_name: frm.doc.cluster_name  // assumes 'town' is the Link field in 'Component At Town'
                }
            };
        });
    }
});


// Validation for number
frappe.ui.form.on("Personal Details", {
    validate: function(frm) {
        if (frm.doc.mobile_number) {
            let mobile = frm.doc.mobile_number.trim();

            if (!/^\d{10}$/.test(mobile)) {
                frappe.throw("Mobile number must be exactly 10 digits.");
            }
        }
    }
});

// Validation for Aadhar card
// frappe.ui.form.on("Personal Details", {
//     aadhar_number: function(frm) {
//         if (frm.doc.aadhar_number) {
//             // Remove non-digit characters first
//             let raw = frm.doc.aadhar_number.replace(/\D/g, "");

//             // Take only first 12 digits
//             raw = raw.substring(0, 12);

//             // Format as XXXX-XXXX-XXXX
//             let formatted = raw.match(/.{1,4}/g)?.join("-") || "";

//             // Update the field value
//             frm.set_value("aadhar_number", formatted);
//         }
//     }
// });

frappe.ui.form.on("Personal Details", {
    // Auto-format Aadhar when user types
    aadhar_number: function(frm) {
        if (frm.doc.aadhar_number) {
            // Remove non-digits
            let raw = frm.doc.aadhar_number.replace(/\D/g, "");
            // Max 12 digits
            raw = raw.substring(0, 12);
            // Format as XXXX-XXXX-XXXX
            let formatted = raw.match(/.{1,4}/g)?.join("-") || "";
            frm.set_value("aadhar_number", formatted);
        }
    },

    // Validate before saving
    validate: function(frm) {
        // ✅ Mobile check
        if (frm.doc.mobile_number) {
            let mobile = frm.doc.mobile_number.trim();
            if (!/^\d{10}$/.test(mobile)) {
                frappe.throw("Mobile number must be exactly 10 digits.");
            }
        }

        // ✅ Aadhar check
        if (frm.doc.aadhar_number) {
            // Remove dashes to count only digits
            let raw = frm.doc.aadhar_number.replace(/-/g, "");
            if (!/^\d{12}$/.test(raw)) {
                frappe.throw("Aadhar number must be exactly 12 digits.");
            }
        }
    }
});
















