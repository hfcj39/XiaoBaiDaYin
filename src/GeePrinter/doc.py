import tempfile
import win32api
import win32print


def doc_printer(filename):
    win32api.ShellExecute(
        0,
        "print",
        filename,
        #
        # If this is None, the default printer will
        # be used anyway.
        #
        '/d:"%s"' % win32print.GetDefaultPrinter(),
        # None,
        ".",
        0
    )
    return "Success"
