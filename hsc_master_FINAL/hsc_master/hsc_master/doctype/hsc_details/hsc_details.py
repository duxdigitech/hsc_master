# Copyright (c) 2025, Dux_Digitech and contributors
# For license information, please see license.txt

# file: hsc_master/hsc_master/doctype/hsc_details/hsc_details.py

import frappe
from frappe.model.document import Document

class HSCDetails(Document):
    def after_insert(self):
        # Ensure a personal detail is linked
        if self.all_details:
            # Update the linked Personal Details connection_status
            frappe.db.set_value("Personal Details", self.all_details, "connection_status", "HSC")
            frappe.db.commit()


# import frappe

# @frappe.whitelist()
# def get_hsc_with_customer(all_details):
#     data = frappe.db.get_value(
#         "Personal Details",
#         all_details,
#         ["name", "customer_name"],
#         as_dict=True
#     )
#     return data



# import frappe
# from frappe.model.document import Document
# class HSCDetails(Document):
# @frappe.whitelist()
# def get_hsc_with_customer():
#     data = []
#     hsc_docs = frappe.get_all("HSC Details", fields=[
#         "name", "hsc_date", "sandle_size", "fcv", "mfta", 
#         "mdpa_pipe_length", "pvc_ball_valve", "cc_cutting_depth", "all_details"
#     ])
    
#     for d in hsc_docs:
#         customer_name = ""
#         if d.all_details:
#             personal_doc = frappe.get_doc("Personal Details", d.all_details)
#             customer_name = personal_doc.customer_name
#         data.append({
#             "hsc_date": d.hsc_date,
#             "sandle_size": d.sandle_size,
#             "fcv": d.fcv,
#             "mfta": d.mfta,
#             "mdpa_pipe_length": d.mdpa_pipe_length,
#             "pvc_ball_valve": d.pvc_ball_valve,
#             "cc_cutting_depth": d.cc_cutting_depth,
#             "customer_name": customer_name
#         })
#     return data



# import frappe
# from frappe.model.document import Document

# class HSCDetails(Document):
#     def after_insert(self):
#         # Update on first save
#         if self.all_details:
#             frappe.db.set_value(
#                 "Personal Details",   # Target Doctype
#                 self.all_details,     # Linked record
#                 "connection_status",  # Field to update
#                 "HSC"                 # New value
#             )

#     def on_submit(self):
#         # Update on submit also
#         if self.all_details:
#             frappe.db.set_value(
#                 "Personal Details",
#                 self.all_details,
#                 "connection_status",
#                 "HSC"
#             )
