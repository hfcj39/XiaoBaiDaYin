#! /usr/bin/env python
# -*- coding: utf-8 -*-
from image import image_printer
from doc import doc_printer
from pdf import pdf_printer
import sys
import re


def check_file_type(path):
    # 检查图片
    pattern = re.compile(r'(.+)(.gif|.jpg|.jpeg|.GIF|.JPG|.JPEG|.png)')
    match = re.match(pattern, path)
    if match:
        return "image"

    # 检查文档
    pattern = re.compile(r'(.+)(.doc|.docx|.DOC|.DOCX)')
    match = re.match(pattern, path)
    if match:
        return "doc"

    # 检查Excel
    pattern = re.compile(r'(.+)(.xls|.xlsx)')
    match = re.match(pattern, path)
    if match:
        return "excel"

    # 检查pdf
    pattern = re.compile(r'(.+)(.pdf|.PDF)')
    match = re.match(pattern, path)
    if match:
        return "pdf"
    else:
        return "Unsupported Type"


try:
    path = sys.argv[1]
    file_type = check_file_type(path)
    if file_type == 'image':
        print(image_printer(path))
    elif file_type == 'doc':
        print(doc_printer(path))
    elif file_type == 'excel':
        print(doc_printer(path))
    elif file_type == 'pdf':
        print(pdf_printer(path))
except Exception as e:
    print(e)
