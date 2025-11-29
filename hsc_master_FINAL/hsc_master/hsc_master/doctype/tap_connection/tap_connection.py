# Copyright (c) 2025, Dux_Digitech and contributors
# For license information, please see license.txt


import frappe
from frappe.model.document import Document

class TapConnection(Document):
  def after_insert(self):
        # Ensure a personal detail is linked
        if self.all_items:
            # Update the linked Personal Details connection_status
            frappe.db.set_value("HSC Details", self.all_items, "connection_status", "Tap Connected")
            frappe.db.commit()


# file: your_app/your_module/hsc_details.py
# file: your_app/your_module/hsc_details.py


# @frappe.whitelist()
# def get_hsc_with_customer(filters=None):
#     filters = filters or {}
    
#     # Fetch HSC Details
#     hsc_list = frappe.get_all(
#         "HSC Details",
#         fields=[
#             "name", "hsc_date", "saddle_size", "fcv", "mfta",
#             "mdpe_pipe_length", "pvc_ball_valve", "cc_cutting_depth",
#             "all_details"
#         ],
#         filters=filters
#     )

#     result = []
#     for hsc in hsc_list:
#         customer_name = ""
#         if hsc.all_details:
#             try:
#                 personal = frappe.get_doc("Personal Details", hsc.all_details)
#                 customer_name = personal.customer_name
#             except Exception:
#                 customer_name = ""
        
#         result.append({
#             "name": hsc.name,
#             "hsc_date": hsc.hsc_date,
#             "saddle_size": hsc.sandle_size,
#             "fcv": hsc.fcv,
#             "mfta": hsc.mfta,
#             "mdpa_pipe_length": hsc.mdpa_pipe_length,
#             "pvc_ball_valve": hsc.pvc_ball_valve,
#             "cc_cutting_depth": hsc.cc_cutting_depth,
#             "customer_name": customer_name
#         })
#     return result
