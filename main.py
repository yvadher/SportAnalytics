import xlrd
workbook = xlrd.open_workbook('data.xls')
worksheet = workbook.sheet_by_name('sheet1')
# Value of 1st row and 1st column
sheet.cell(0, 0).value
