import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QPushButton, QLabel, QProgressBar, QVBoxLayout, QWidget, QFileDialog
from PyQt5.QtCore import Qt, QThread, pyqtSignal
from PyQt5.QtGui import QPixmap
from PIL import Image
from tqdm import tqdm
import concurrent.futures
import imagehash
import itertools
import threading
import math
import os
import argparse
import shutil


class DuplicateImageFinder(QMainWindow):
    def __init__(self):
        super().__init__()

        self.setWindowTitle("Duplicate Image Finder")
        self.setGeometry(100, 100, 400, 200)

        # Create widgets
        self.label = QLabel("Select Folder:")
        self.progress_label = QLabel("Progress:")
        self.progress_bar = QProgressBar()
        self.progress_bar.setTextVisible(True)
        self.progress_bar.setRange(0, 100)
        self.progress_bar.setValue(0)
        self.start_button = QPushButton("Start")

        # Connect button signal to start processing
        self.start_button.clicked.connect(self.start_processing)

        # Create layout
        layout = QVBoxLayout()
        layout.addWidget(self.label)
        layout.addWidget(self.progress_label)
        layout.addWidget(self.progress_bar)
        layout.addWidget(self.start_button)

        # Create central widget and set layout
        central_widget = QWidget()
        central_widget.setLayout(layout)

        # Set central widget
        self.setCentralWidget(central_widget)

    def start_processing(self):
        folder_path = self.select_folder()
        if folder_path:
            self.start_button.setEnabled(False)
            self.progress_bar.setValue(0)
            self.worker = ImageProcessingWorker(folder_path)
            self.worker.progress_update.connect(self.update_progress)
            self.worker.finished.connect(self.processing_finished)
            self.worker.start()

    def update_progress(self, progress):
        self.progress_bar.setValue(progress)

    def processing_finished(self):
        self.start_button.setEnabled(True)

    def select_folder(self):
        folder_path = str(QFileDialog.getExistingDirectory(self, "Select Folder"))
        if folder_path:
            self.label.setText("Folder selected: " + folder_path)
            return folder_path
        else:
            self.label.setText("Select Folder:")
            return None



class ImageProcessingWorker(QThread):
    progress_update = pyqtSignal(int)
    finished = pyqtSignal()

    def __init__(self, folder_path):
        super().__init__()
        self.folder_path = folder_path

    def run(self):
        # Your existing code goes here
        # ...
        print(self.folder_path)
        from picpurge import init

        init(self.folder_path, 3)

        self.progress_update.emit(100)  # Update progress bar to 100% when processing is finished
        self.finished.emit()


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = DuplicateImageFinder()
    window.show()
    sys.exit(app.exec())

