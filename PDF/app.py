from flask import Flask, render_template, request, send_file, session, redirect, url_for
import PyPDF2
import io
import os

app = Flask(__name__)
app.secret_key = 'your_secret_key'

UPLOAD_FOLDER = os.path.join(app.root_path, 'uploads')
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/merge', methods=['GET', 'POST'])
def merge():
    if 'file_list' not in session:
        session['file_list'] = []

    if request.method == 'POST':
        if 'pdfFiles' in request.files:
            files = request.files.getlist('pdfFiles')
            for file in files:
                filename = os.path.join(UPLOAD_FOLDER, file.filename)
                file.save(filename)
                session['file_list'].append(filename)
            return redirect(url_for('merge'))

        if 'merge' in request.form:
            pdf_writer = PyPDF2.PdfWriter()
            for filepath in session['file_list']:
                with open(filepath, 'rb') as f:
                    pdf_reader = PyPDF2.PdfReader(f)
                    for page in pdf_reader.pages:
                        pdf_writer.add_page(page)

            output_stream = io.BytesIO()
            pdf_writer.write(output_stream)
            output_stream.seek(0)

            # Clean up the uploaded files and session
            for filepath in session['file_list']:
                os.remove(filepath)
            session.pop('file_list', None)

            return send_file(output_stream, as_attachment=True, download_name='merged.pdf', mimetype='application/pdf')

    return render_template('merge.html', files=[os.path.basename(file) for file in session['file_list']])

@app.route('/split', methods=['GET', 'POST'])
def split():
    if request.method == 'POST':
        file = request.files['pdfFile']
        start_page = int(request.form['startPage'])
        end_page = int(request.form['endPage'])
        
        pdf_reader = PyPDF2.PdfReader(file.stream)
        pdf_writer = PyPDF2.PdfWriter()

        for page_num in range(start_page - 1, end_page):
            pdf_writer.add_page(pdf_reader.pages[page_num])

        output_stream = io.BytesIO()
        pdf_writer.write(output_stream)
        output_stream.seek(0)

        return send_file(output_stream, as_attachment=True, download_name='split.pdf', mimetype='application/pdf')
    return render_template('split.html')

@app.route('/rotate', methods=['GET', 'POST'])
def rotate():
    if request.method == 'POST':
        file = request.files['pdfFile']
        rotation_angle = int(request.form['rotationAngle'])
        
        pdf_reader = PyPDF2.PdfReader(file.stream)
        pdf_writer = PyPDF2.PdfWriter()

        for page in pdf_reader.pages:
            page.rotate(rotation_angle)
            pdf_writer.add_page(page)

        output_stream = io.BytesIO()
        pdf_writer.write(output_stream)
        output_stream.seek(0)

        return send_file(output_stream, as_attachment=True, download_name='rotated.pdf', mimetype='application/pdf')
    return render_template('rotate.html')

@app.route('/extract', methods=['GET', 'POST'])
def extract():
    if request.method == 'POST':
        file = request.files['pdfFile']
        
        pdf_reader = PyPDF2.PdfReader(file.stream)
        extracted_text = ""
        
        for page in pdf_reader.pages:
            extracted_text += page.extract_text() + "\n"

        return render_template('extract.html', extracted_text=extracted_text)
    return render_template('extract.html')

if __name__ == '__main__':
    app.run(debug=True)
