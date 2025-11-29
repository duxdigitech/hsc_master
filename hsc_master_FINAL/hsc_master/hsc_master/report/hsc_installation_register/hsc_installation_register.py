import frappe
from frappe.utils import get_url

def execute(filters=None):
    columns = [
        {"label": "Date", "fieldname": "date", "fieldtype": "Date", "width": 100},
        {"label": "Project/Town", "fieldname": "mr_projecttown", "fieldtype": "Data", "width": 150},
        {"label": "Party Name", "fieldname": "party_name", "fieldtype": "Data", "width": 150},
        {"label": "Material Name", "fieldname": "mr_material_name", "fieldtype": "Data", "width": 150},
        {"label": "Unit", "fieldname": "material_unit", "fieldtype": "Data", "width": 80},
        {"label": "Quantity", "fieldname": "material_quantity", "fieldtype": "Float", "width": 100},
        {"label": "Material Image", "fieldname": "material_image", "fieldtype": "HTML", "width": 130},
    ]

    data = frappe.get_all(
        "PR Material Recived",
        fields=["name","date","mr_projecttown","party_name","mr_material_name","material_unit","material_quantity"],
        order_by="date desc"
    )

    for d in data:
        file = frappe.get_all(
            "File",
            filters={"attached_to_doctype":"PR Material Recived","attached_to_name":d.name},
            fields=["file_url"],
            order_by="creation desc",
            limit_page_length=1
        )
        if file:
            url = get_url(file[0].file_url)
            # Add onclick to call global JS function
            d["material_image"] = f'''
                <img src="{url}" style="height:45px;width:45px;object-fit:contain;border-radius:6px;cursor:pointer;"
                     onclick="showMaterialImage('{url}');event.stopPropagation();">
            '''
        else:
            d["material_image"] = ""

    return columns, data
