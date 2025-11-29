# Copyright (c) 2025, Dux_Digitech and contributors
# For license information, please see license.txt


# file: personal_details/personal_details.py
# file: personal_details/personal_details.py
# import frappe
# from frappe.model.document import Document

# class PersonalDetails(Document):
#     def validate(self):
#         if self.customer_survey_number:
#             # Get any record with the same Customer Survey Number, excluding the current one
#             duplicates = frappe.get_all(
#                 "Personal Details",
#                 filters={
#                     "customer_survey_number": self.customer_survey_number
#                 },
#                 fields=["name"]
#             )

#             # Remove current record from duplicates if editing
#             duplicates = [d for d in duplicates if d.name != self.name]

#             if duplicates:
#                 frappe.throw(
#                     f"Customer Survey Number '{self.customer_survey_number}' already exists. Please provide a unique number."
#                 )

# file: personal_details/personal_details.py
# import frappe
# from frappe.model.document import Document

# class PersonalDetails(Document):
#     def validate(self):
#         if self.customer_survey_number and self.village_name:
#             # Get any record with the same Customer Survey Number in the same village
#             duplicates = frappe.get_all(
#                 "Personal Details",
#                 filters={
#                     "village_name": self.village_name,
#                     "customer_survey_number": self.customer_survey_number
#                 },
#                 fields=["name"]
#             )

#             # Remove current record if editing
#             duplicates = [d for d in duplicates if d.name != self.name]

#             if duplicates:
#                 frappe.throw(
#                     f"Customer Survey Number '{self.customer_survey_number}' already exists in village '{self.village_name}'. Please enter a unique number."
#                 )

# import frappe
# from frappe.model.document import Document

# class PersonalDetails(Document):
#     def validate(self):
#         if self.customer_survey_number and self.village_name:
#             # Check for duplicates within the same village only
#             duplicates = frappe.get_all(
#                 "Personal Details",
#                 filters={
#                     "village_name": self.village_name,
#                     "customer_survey_number": self.customer_survey_number,
#                     "name": ["!=", self.name]  # Exclude current record when editing
#                 },
#                 limit=1
#             )

#             if duplicates:
#                 frappe.throw(
#                     f"Customer Survey Number '{self.customer_survey_number}' is already used in village '{self.village_name}'. It must be unique within the same village."
#                 );

# For Validation of Customer survey
import frappe
from frappe.model.document import Document

class PersonalDetails(Document):
    def validate(self):
        # 🎯 CRITICAL FIX: Check if the fields are NOT None.
        # This ensures the validation runs for any entered value, including 0.
        
        # Check 1: Ensure both fields have some value (not None).
        if self.customer_survey_number is not None and self.village_name is not None:
            
            # Additional Check (Optional but recommended): If the field is a string-based "Data" type,
            # you might also want to ensure it's not an empty string, which is also falsy.
            if self.customer_survey_number == "" or self.village_name == "":
                # If you want to stop here for empty strings, you can return or pass.
                # Assuming your fields are mandatory, Frappe's framework handles empty mandatory fields.
                pass
            
            # Proceed with the duplicate check now that we know a value exists (even if 0)
            duplicates = frappe.get_all(
                "Personal Details",
                filters={
                    "village_name": self.village_name,
                    "customer_survey_number": self.customer_survey_number,
                    "name": ["!=", self.name]  # Exclude current record when editing
                },
                limit=1
            )

            if duplicates:
                # If a duplicate is found (for customer_survey_number=0 or any other number),
                # this error will be thrown, preventing the document from saving.
                frappe.throw(
                    f"Customer Survey Number '{self.customer_survey_number}' is already used in village '{self.village_name}'. It must be unique within the same village."
                )


# Validation for mobile number 

# import frappe
# from frappe.model.document import Document

# class PersonalDetails(Document):
#     def validate(self):
#         # Ensure mobile number has exactly 10 digits
#         if self.mobile_number:
#             mobile = str(self.mobile_number).strip()

#             # Check if it's only digits and has exactly 10 numbers
#             if not mobile.isdigit() or len(mobile) != 10:
#                 frappe.throw("Mobile number must be exactly 10 digits.")


