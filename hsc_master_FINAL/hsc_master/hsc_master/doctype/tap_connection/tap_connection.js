// Copyright (c) 2025, Dux_Digitech and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Tap Connection", {
// 	refresh(frm) {

// 	},
// });

// Only draft and submit status

frappe.ui.form.on('Tap Connection', {
    onload: function(frm) {
        frm.set_query('all_items', function() {
            return {
                filters: {
                    connection_status: ['in', ['Submitted', 'Draft']]
                }
            };
        });
    }
});


// Table of dialog pick


frappe.ui.form.on('Tap Connection', {
    refresh: function (frm) {
        setup_tap_picker(frm, {
            link_field: "all_items",
            linked_doctype: "HSC Details",
            columns_to_show: [
                "customer_name",
                "display_name",
                "cluster_name",
                "hsc_date",
                "saddle_size",
                "fcv",
                "mfta",
                "mdpa_pipe_length"
            ]
        });
    }
});

function setup_tap_picker(frm, opts) {
    const field = frm.fields_dict[opts.link_field];
    if (!field || !field.$input) return;

    add_suffix_button(field, "Pick", () => open_tap_picker_dialog(frm, opts));
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

function open_tap_picker_dialog(frm, { link_field, linked_doctype, columns_to_show }) {
    frappe.model.with_doctype(linked_doctype, () => {
        const meta = frappe.get_meta(linked_doctype);
        const valid_fields = columns_to_show.filter(f => meta.fields.some(mf => mf.fieldname === f));
        valid_fields.unshift("name");

        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: linked_doctype,
                fields: valid_fields,
                filters: {
                    connection_status: ["in", ["Draft", "Submited"]]
                },
                limit_page_length: 2000, // fetch large set once
                order_by: "creation desc"
            },
            callback: function (r) {
                let data = r.message || [];
                let filtered_data = [...data];

                let selected_name = null;
                let current_page = 1;
                const page_size = 50; // 50 per page

                const d = new frappe.ui.Dialog({
                    title: __("Select HSC Detail"),
                    size: "extra-large",
                    fields: [
                        {
                            fieldname: "search_box",
                            fieldtype: "Data",
                            label: __("Search"),
                            placeholder: "Search by Customer Name or Block/Zone",
                            onchange: function () {
                                const search_val = (this.value || "").toLowerCase();
                                filtered_data = data.filter(row =>
                                    (row.customer_name || "").toLowerCase().includes(search_val) ||
                                    (row.display_name || "").toLowerCase().includes(search_val)
                                );
                                current_page = 1;
                                render_table();
                            }
                        },
                        {
                            fieldname: "tap_html",
                            fieldtype: "HTML"
                        },
                        {
                            fieldname: "pagination_html",
                            fieldtype: "HTML"
                        }
                    ],
                    primary_action_label: __("Use Selected"),
                    primary_action(values) {
                        if (selected_name) {
                            frm.set_value(link_field, selected_name);
                            d.hide();
                        } else {
                            frappe.msgprint("Please select a record first.");
                        }
                    }
                });

                function render_table() {
                    const start = (current_page - 1) * page_size;
                    const end = start + page_size;
                    const page_data = filtered_data.slice(start, end);

                    let html = `
                        <div style="max-height:400px;overflow:auto;font-size:12px;">
                            <table class="table table-bordered table-hover" style="font-size:12px;">
                                <thead>
                                    <tr style="font-weight:normal;">
                                        <th style="font-weight:normal;">Select</th>
                                        ${columns_to_show.map(f => `<th style="font-weight:normal;">${f === "display_name" ? "Block/Zone" : f.replace(/_/g, " ")}</th>`).join("")}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${page_data.map(row => `
                                        <tr data-name="${row.name}" style="cursor:pointer;">
                                            <td><input type="radio" name="row_select" value="${row.name}" ${row.name === selected_name ? "checked" : ""}></td>
                                            ${columns_to_show.map(f => `<td>${row[f] || ""}</td>`).join("")}
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </div>
                    `;
                    d.fields_dict.tap_html.$wrapper.html(html);

                    // Pagination controls
                    const total_pages = Math.ceil(filtered_data.length / page_size);
                    let pagination_html = `
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px;font-size:12px;">
                            <button class="btn btn-sm btn-secondary prev-page" ${current_page === 1 ? "disabled" : ""}>Prev</button>
                            <span>Page ${current_page} of ${total_pages}</span>
                            <button class="btn btn-sm btn-secondary next-page" ${current_page === total_pages ? "disabled" : ""}>Next</button>
                        </div>
                    `;
                    d.fields_dict.pagination_html.$wrapper.html(pagination_html);

                    // Radio select
                    d.fields_dict.tap_html.$wrapper.find('input[type=radio]').on("change", function () {
                        selected_name = $(this).val();
                    });

                    // Double-click = select
                    d.fields_dict.tap_html.$wrapper.find("tr").on("dblclick", function () {
                        selected_name = $(this).data("name");
                        frm.set_value(link_field, selected_name);
                        d.hide();
                    });

                    // Pagination button clicks
                    d.fields_dict.pagination_html.$wrapper.find(".prev-page").on("click", () => {
                        if (current_page > 1) {
                            current_page--;
                            render_table();
                        }
                    });
                    d.fields_dict.pagination_html.$wrapper.find(".next-page").on("click", () => {
                        if (current_page < total_pages) {
                            current_page++;
                            render_table();
                        }
                    });
                }

                render_table();
                d.show();
            }
        });
    });
}

































