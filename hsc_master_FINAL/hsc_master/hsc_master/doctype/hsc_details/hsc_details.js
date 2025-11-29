// Copyright (c) 2025, Dux_Digitech and contributors
// For license information, please see license.txt

// frappe.ui.form.on("HSC Details", {
// 	refresh(frm) {

// 	},
// });

// HSC Details

// HSC Update Status

frappe.ui.form.on("HSC Details", {
    before_save: function(frm) {
        if (!frm.doc.connection_status) {
            frm.set_value("connection_status", "HSC");
        }
    }
});

// HSC Status New

frappe.ui.form.on('HSC Details', {
    onload: function(frm) {
        frm.set_query('all_details', function() {
            return {
                filters: {
                 Connection_status: 'New'
                }
            };
        });
    }
});

// HSC Display Name

frappe.ui.form.on("HSC Details", {
    hsc_date(frm) {
        set_display_name(frm);
    }
});

function set_display_name(frm) {
    const parts = [
        frm.doc.customer_name,
        frm.doc.hsc_date
    ]
    .filter(Boolean)
    .map(v => String(v).trim());

    const value = parts.join(" - ");

    if (frm.doc.all_items !== value) {
        frm.set_value("all_items", value || "");
    }
}

// Full width script

frappe.ui.form.on('HSC Details', {
  refresh: function(frm) {
    frm.fields_dict['all_details'].wrapper.style.width = '1200px';
  }
});

// Submit Button for HSC Details

frappe.ui.form.on('HSC Details', {
    refresh: function(frm) {
        // Disable default save button
        frm.disable_save();

        // Agar existing document hai (not new)
        if (!frm.is_new()) {

            // Agar connection_status Draft hai
            if (frm.doc.connection_status === 'Draft') {
                // Custom Submit button
                frm.add_custom_button(__('Submit'), function () {
                    frm.set_value('connection_status', 'Submitted');

                    frm.save().then(() => {
                        frappe.msgprint(__('Form submitted successfully.'));
                    });
                });
            }

        } else {
            // Agar naya document hai (NEW), to kuch mat karo
            // You can enable Save if needed
            frm.enable_save();
        }
    }
});

// Table Display HSC Master

// frappe.ui.form.on('HSC Details', {
//     refresh: function(frm) {
//         setup_personal_picker(frm, {
//             link_field: "all_details",
//             linked_doctype: "Personal Details",
//             columns_to_show: [
//                 "customer_name",
//                 "display_name",   // backend fieldname stays same
//                 "cluster_name",
//                 "mobile_number",
//                 "aadhar_number",
//                 "types_of_connection"
//             ]
//         });
//     }
// });

// function setup_personal_picker(frm, opts) {
//     const field = frm.fields_dict[opts.link_field];
//     if (!field || !field.$input) return;

//     add_suffix_button(field, "Pick", () => open_picker_dialog(frm, opts));
// }

// function add_suffix_button(field, label, on_click) {
//     const $wrap = field.$wrapper.find(".control-input");
//     if ($wrap.parent().hasClass("picker-flex")) {
//         $wrap.unwrap();
//         $wrap.siblings(".btn").remove();
//     }

//     const $flex = $('<div class="picker-flex" style="display:flex;align-items:center;gap:8px;"></div>');
//     $wrap.wrap($flex);

//     const $btn = $(`
//         <button type="button" class="btn btn-sm btn-outline-primary" title="Open picker">
//             <i class="fa fa-table" style="margin-right:6px;"></i>${label}
//         </button>
//     `);

//     $wrap.after($btn);
//     $btn.on("click", (e) => {
//         e.preventDefault();
//         e.stopPropagation();
//         on_click();
//     });
// }

// function open_picker_dialog(frm, { link_field, linked_doctype, columns_to_show }) {
//     frappe.model.with_doctype(linked_doctype, () => {
//         const meta = frappe.get_meta(linked_doctype);
//         const valid_fields = columns_to_show.filter(f => meta.fields.some(mf => mf.fieldname === f));
//         valid_fields.unshift("name"); // always include name

//         frappe.call({
//             method: "frappe.client.get_list",
//             args: {
//                 doctype: linked_doctype,
//                 fields: valid_fields,
//                 filters: { connection_status: "New" },
//                 limit_page_length: 100
//             },
//             callback: function(r) {
//                 let data = r.message || [];
//                 let filtered_data = [...data]; // copy for search

//                 let d = new frappe.ui.Dialog({
//                     title: __("Select Personal Detail"),
//                     size: "extra-large",
//                     fields: [
//                         {
//                             fieldname: "search_box",
//                             fieldtype: "Data",
//                             label: __("Search"),
//                             placeholder: "Find by customer name",
//                             onchange: function() {
//                                 const search_val = (this.value || "").toLowerCase();
//                                 filtered_data = data.filter(row =>
//                                     (row.customer_name || "").toString().toLowerCase().includes(search_val)
//                                 );
//                                 grid.df.data = filtered_data;
//                                 grid.refresh();
//                             }
//                         },
//                         {
//                             fieldname: "personal_table",
//                             fieldtype: "Table",
//                             cannot_add_rows: true,
//                             in_place_edit: false,
//                             editable_grid: false,
//                             no_delete_row: true,
//                             no_duplicate_row: true,
//                             data: filtered_data,
//                             get_data: () => filtered_data,
//                             fields: valid_fields.filter(f => f !== "name").map(fn => ({
//                                 fieldtype: 'Data',
//                                 fieldname: fn,
//                                 label: fn === "display_name" 
//                                         ? "Block/Zone"    // ✅ Only change label for UI
//                                         : fn.replace(/_/g, " ").toUpperCase(),
//                                 in_list_view: 1,
//                                 read_only: 1
//                             }))
//                         }
//                     ],
//                     primary_action_label: __("Use Selected"),
//                     primary_action(values) {
//                         let selected = d.fields_dict.personal_table.grid.get_selected_children();
//                         if (selected.length) {
//                             let row = selected[0];
//                             frm.set_value(link_field, row.name);
//                             d.hide();
//                         } else {
//                             frappe.msgprint("Please select a record first.");
//                         }
//                     }
//                 });

//                 const grid = d.fields_dict.personal_table.grid;
//                 const wrapper = grid.wrapper;

//                 // bring search bar closer to table and left-align it
//                 const $search = d.fields_dict.search_box.$wrapper;
//                 $search.css({
//                     "margin-bottom": "8px",
//                     "text-align": "left",
//                     "justify-content": "flex-start"
//                 });

//                 // REMOVE all row action buttons completely
//                 function disable_row_actions() {
//                     wrapper.find(".grid-row-action, .grid-row-menu, .grid-row-edit").remove();
//                 }
//                 disable_row_actions();
//                 grid.wrapper.on("DOMNodeInserted", ".grid-row", disable_row_actions);

//                 // Remove the empty "Add Row" at bottom
//                 wrapper.find(".grid-add-row").remove();

//                 // Add checkbox column for single-select
//                 function add_checkboxes() {
//                     wrapper.find("tr").each(function(idx) {
//                         const $tr = $(this);
//                         if ($tr.find(".custom-single-checkbox").length === 0) {
//                             $tr.prepend('<td class="custom-single-checkbox" style="width:20px;text-align:center;"><input type="checkbox"></td>');
//                         }
//                     });
//                 }
//                 add_checkboxes();

//                 // Checkbox click: allow only one selection at a time + sync with grid selection
//                 wrapper.on("click", "input[type=checkbox]", function(e) {
//                     wrapper.find("input[type=checkbox]").not(this).prop("checked", false);
//                     grid.get_selected().forEach(r => grid.unselect_row(r));

//                     let $row = $(this).closest("tr");
//                     let row = grid.get_row($row[0]);

//                     if (this.checked && row) {
//                         grid.select_row(row);
//                     }
//                 });

//                 // Double-click row = confirm selection
//                 wrapper.on("dblclick", "tr", function() {
//                     let row = grid.get_row(this);
//                     if (row) {
//                         grid.select_row(row);
//                         frm.set_value(link_field, row.doc.name);
//                         d.hide();
//                     }
//                 });

//                 d.show();
//             }
//         });
//     });
// }

frappe.ui.form.on('HSC Details', {
    refresh: function(frm) {
        setup_personal_picker(frm, {
            link_field: "all_details",
            linked_doctype: "Personal Details",
            columns_to_show: [
                "customer_name",
                "display_name",   // backend fieldname stays same
                "cluster_name",
                "mobile_number",
                "aadhar_number",
                "types_of_connection"
            ]
        });
    }
});

function setup_personal_picker(frm, opts) {
    const field = frm.fields_dict[opts.link_field];
    if (!field || !field.$input) return;

    add_suffix_button(field, "Pick", () => open_picker_dialog(frm, opts));
}

function add_suffix_button(field, label, on_click) {
    const $wrap = field.$wrapper.find(".control-input");
    if ($wrap.parent().hasClass("picker-flex")) {
        $wrap.unwrap();
        $wrap.siblings(".btn").remove();
    }

    const $flex = $('<div class="picker-flex" style="display:flex;align-items:center;gap:8px;"></div>');
    $wrap.wrap($flex);

    const $btn = $(`
        <button type="button" class="btn btn-sm btn-outline-primary" title="Open picker">
            <i class="fa fa-table" style="margin-right:6px;"></i>${label}
        </button>
    `);

    $wrap.after($btn);
    $btn.on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        on_click();
    });
}

function open_picker_dialog(frm, { link_field, linked_doctype, columns_to_show }) {
    frappe.model.with_doctype(linked_doctype, () => {
        const meta = frappe.get_meta(linked_doctype);
        const valid_fields = columns_to_show.filter(f => meta.fields.some(mf => mf.fieldname === f));
        valid_fields.unshift("name"); // always include name

        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: linked_doctype,
                fields: valid_fields,
                filters: { connection_status: "New" },
                limit_page_length: 100,
                order_by: "creation desc"   // ✅ newest entry at top
            },
            callback: function(r) {
                let data = r.message || [];
                let filtered_data = [...data]; // copy for search

                let d = new frappe.ui.Dialog({
                    title: __("Select Personal Detail"),
                    size: "extra-large",
                    fields: [
                        {
                            fieldname: "search_box",
                            fieldtype: "Data",
                            label: __("Search"),
                            placeholder: "Find by customer name",
                            onchange: function() {
                                const search_val = (this.value || "").toLowerCase();
                                filtered_data = data.filter(row =>
                                    (row.customer_name || "").toString().toLowerCase().includes(search_val)
                                );
                                grid.df.data = filtered_data;
                                grid.refresh();
                            }
                        },
                        {
                            fieldname: "personal_table",
                            fieldtype: "Table",
                            cannot_add_rows: true,
                            in_place_edit: false,
                            editable_grid: false,
                            no_delete_row: true,
                            no_duplicate_row: true,
                            data: filtered_data,
                            get_data: () => filtered_data,
                            fields: valid_fields.filter(f => f !== "name").map(fn => ({
                                fieldtype: 'Data',
                                fieldname: fn,
                                label: fn === "display_name" 
                                        ? "Block/Zone"    // ✅ Only change label for UI
                                        : fn.replace(/_/g, " ").toUpperCase(),
                                in_list_view: 1,
                                read_only: 1
                            }))
                        }
                    ],
                    primary_action_label: __("Use Selected"),
                    primary_action(values) {
                        let selected = d.fields_dict.personal_table.grid.get_selected_children();
                        if (selected.length) {
                            let row = selected[0];
                            frm.set_value(link_field, row.name);
                            d.hide();
                        } else {
                            frappe.msgprint("Please select a record first.");
                        }
                    }
                });

                const grid = d.fields_dict.personal_table.grid;
                const wrapper = grid.wrapper;

                // bring search bar closer to table and left-align it
                const $search = d.fields_dict.search_box.$wrapper;
                $search.css({
                    "margin-bottom": "8px",
                    "text-align": "left",
                    "justify-content": "flex-start"
                });

                // REMOVE all row action buttons completely
                function disable_row_actions() {
                    wrapper.find(".grid-row-action, .grid-row-menu, .grid-row-edit").remove();
                }
                disable_row_actions();
                grid.wrapper.on("DOMNodeInserted", ".grid-row", disable_row_actions);

                // Remove the empty "Add Row" at bottom
                wrapper.find(".grid-add-row").remove();

                // Add checkbox column for single-select
                function add_checkboxes() {
                    wrapper.find("tr").each(function(idx) {
                        const $tr = $(this);
                        if ($tr.find(".custom-single-checkbox").length === 0) {
                            $tr.prepend('<td class="custom-single-checkbox" style="width:20px;text-align:center;"><input type="checkbox"></td>');
                        }
                    });
                }
                add_checkboxes();

                // Checkbox click: allow only one selection at a time + sync with grid selection
                wrapper.on("click", "input[type=checkbox]", function(e) {
                    wrapper.find("input[type=checkbox]").not(this).prop("checked", false);
                    grid.get_selected().forEach(r => grid.unselect_row(r));

                    let $row = $(this).closest("tr");
                    let row = grid.get_row($row[0]);

                    if (this.checked && row) {
                        grid.select_row(row);
                    }
                });

                // Double-click row = confirm selection
                wrapper.on("dblclick", "tr", function() {
                    let row = grid.get_row(this);
                    if (row) {
                        grid.select_row(row);
                        frm.set_value(link_field, row.doc.name);
                        d.hide();
                    }
                });

                d.show();
            }
        });
    });
}

// Block name hidden

frappe.ui.form.on('HSC Details', {
    all_details: function(frm) {
        if(frm.doc.all_details) {
            // Fetch the selected Personal Details record
            frappe.db.get_doc('Personal Details', frm.doc.all_details)
            .then(personal => {
                // Set HSC Details fields from Personal Details
                frm.set_value('display_name', personal.display_name);
                frm.set_value('cluster_name', personal.cluster_name);
                frm.set_value('village_name', personal.village_name);
            });
        } else {
            // Clear fields if no Personal Detail is selected
            frm.set_value('display_name', '');
            frm.set_value('cluster_name', '');
            frm.set_value('village_name', '');
        }
    }
});


