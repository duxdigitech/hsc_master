// Copyright (c) 2025, Dux_Digitech and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Block at Zone", {
// 	refresh(frm) {

// 	},
// });
// Block at Zone display name

// frappe.ui.form.on('Block at Zone', {
    
//     block_name(frm) {
//         set_display_name(frm);
//     },
//     zone_name(frm) {
//         set_display_name(frm);
//     }
// });

// function set_display_name(frm) {
//     const parts = [frm.doc.zone_name,frm.doc.block_name ]
//         .filter(Boolean)
//         .map(v => String(v).trim());
//     const value = parts.join(" - "); // e.g., "Project - Town"
//     if (frm.doc.display_name !== value) {
//         frm.set_value("display_name", value || "");
//     }
// }
frappe.ui.form.on('Block at Zone', {
    block_name(frm) {
        set_display_name(frm);
    },
    zone_name(frm) {
        set_display_name(frm);
    }
});

function set_display_name(frm) {
    if (!frm.doc.block_name) {
        // If no block selected, just use zone_name
        const value = frm.doc.zone_name || "";
        frm.set_value("display_name", value);
        return;
    }

    // Fetch the actual block_name from the linked Block doctype
    frappe.db.get_value('Block Details', frm.doc.block_name, 'block_name')
        .then(r => {
            const block_real_name = r.message ? r.message.block_name : "";
            const parts = [frm.doc.zone_name, block_real_name]
                .filter(Boolean)
                .map(v => String(v).trim());
            const value = parts.join(" - ");
            if (frm.doc.display_name !== value) {
                frm.set_value("display_name", value || "");
            }
        });
}
