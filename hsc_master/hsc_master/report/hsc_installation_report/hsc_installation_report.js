/* global frappe */

frappe.query_reports["HSC Installation Report"] = {
  filters: [
    {
      fieldname: "from_date",
      label: "From Date",
      fieldtype: "Date",
      default: frappe.datetime.month_start()
    },
    {
      fieldname: "to_date",
      label: "To Date",
      fieldtype: "Date",
      default: frappe.datetime.month_end()
    },
    {
      fieldname: "block_zone",
      label: "Block/Zone",
      fieldtype: "Link",
      options: "Block at Zone",
      on_change: () => {
        // Clear children and refresh
        frappe.query_report.set_filter_value({
          cluster: "",
          village: "",
          contractor_firm: ""
        });
        frappe.query_report.refresh();
      }
    },
    {
      fieldname: "cluster",
      label: "Cluster",
      fieldtype: "Link",
      options: "Cluster Details",
      get_query: () => {
        const bz = frappe.query_report.get_filter_value("block_zone");
        // Adjust 'display_name' if your Cluster ↔ Block link field is different
        return bz ? { filters: { display_name: bz } } : {};
      },
      on_change: () => {
        frappe.query_report.set_filter_value({
          village: "",
          contractor_firm: ""
        });
        frappe.query_report.refresh();
      }
    },
    {
      fieldname: "village",
      label: "Village",
      fieldtype: "Link",
      options: "Village Details",
      get_query: () => {
        const cl = frappe.query_report.get_filter_value("cluster");
        return cl ? { filters: { cluster_name: cl } } : {};
      },
      on_change: () => frappe.query_report.refresh()
    },
    {
      fieldname: "contractor_firm",
      label: "Contractor Firm",
      fieldtype: "Link",
      options: "Contractor At Cluster",
      get_query: () => {
        const cl = frappe.query_report.get_filter_value("cluster");
        return cl ? { filters: { cluster_name: cl } } : {};
      },
      on_change: () => frappe.query_report.refresh()
    }
  ],

  // No onload override — Frappe will auto-run using the defaults.
  
  formatter(value, row, column, data, default_formatter) {
    const htmlCols = new Set([
      "aadhar_card_photo",
      "customer_photo",
      "samagra_id_photo",
      "connection_photo",
      "form_photo",
      "tap_connection_photo",
    ]);
    if (htmlCols.has(column.fieldname)) return value || "";
    return default_formatter(value, row, column, data);
  },
};
