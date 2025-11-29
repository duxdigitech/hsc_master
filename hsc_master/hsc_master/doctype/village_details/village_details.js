// Copyright (c) 2025, Dux_Digitech and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Village Details", {
// 	refresh(frm) {

// 	},
// });
// Cascading of village

frappe.ui.form.on('Village Details', {
    display_name: function(frm) {
        // Clear component field when town is changed
        frm.set_value('cluster_name', '');

        // Filter component based on selected town
        frm.set_query('cluster_name', function() {
            return {
                filters: {
                    display_name: frm.doc.display_name // assumes 'town' is the Link field in 'Component At Town'
                }
            };
        });
    }
});
