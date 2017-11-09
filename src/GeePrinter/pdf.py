import win32api
import win32print
import os
def pdf_printer(filename):
    res = os.popen("\"C:\Program Files (x86)\Adobe\Acrobat Reader DC\Reader\AcroRd32.exe\" /p /t " + filename)
    return "Success"
