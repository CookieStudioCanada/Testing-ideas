from flask import Flask, render_template, request, send_file, flash, send_from_directory, redirect, url_for
from scraper import scrape_and_generate
import os
from jinja2 import Environment
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate
import requests

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Change this to a secure secret key

app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')

def nl2br(value):
    if not value:
        return value
    return value.replace('\n', '<br>\n')

# Add the filter to your Jinja environment
jinja_env = Environment()
jinja_env.filters['nl2br'] = nl2br

@app.template_filter('nl2br')
def nl2br_filter(value):
    if not value:
        return value
    return value.replace('\n', '<br>\n')

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        urls = request.form.get('urls', '').split(',')
        urls = [url.strip() for url in urls if url.strip()]
        prompt = request.form.get('prompt', '')

        if not urls:
            flash('Please enter at least one URL', 'error')
            return render_template('index.html')

        if not prompt:
            flash('Please enter a prompt', 'error')
            return render_template('index.html')

        try:
            # Generate content with debug info
            print(f"Debug - URLs: {urls}")  # Debug print
            print(f"Debug - Prompt: {prompt}")  # Debug print
            
            generated_content = scrape_and_generate(urls, prompt)
            print(f"Debug - Generated content: {generated_content}")  # Debug print
            
            if not generated_content:
                raise ValueError("Le contenu n'a pas été généré. Vérifiez que les URLs sont accessibles et que le prompt est valide.")
            
            # Generate PDF with error checking
            pdf_path = save_to_pdf(urls, prompt, generated_content)
            if not pdf_path:
                raise ValueError("PDF generation failed - check server logs for details")
            
            # Extract filename only if PDF was created successfully
            pdf_filename = os.path.basename(pdf_path)
            
            return render_template('result.html', 
                                 urls=urls, 
                                 prompt=prompt, 
                                 content=generated_content,
                                 pdf_filename=pdf_filename)
        except Exception as e:
            flash(f'An error occurred: {str(e)}', 'error')
            return render_template('index.html')

    return render_template('index.html')

@app.route('/download/<path:filename>')
def download_file(filename):
    try:
        # Utiliser le même chemin que dans save_to_pdf
        pdf_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pdfs')
        return send_from_directory(pdf_dir, filename, as_attachment=True)
    except Exception as e:
        flash(f'Erreur lors du téléchargement: {str(e)}', 'error')
        return redirect(url_for('index'))

def save_to_pdf(urls, prompt, content):
    try:
        # Créer un nom de fichier unique avec timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'generated_content_{timestamp}.pdf'
        
        # S'assurer que le dossier pdfs existe
        pdf_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pdfs')
        if not os.path.exists(pdf_dir):
            os.makedirs(pdf_dir)
        
        pdf_path = os.path.join(pdf_dir, filename)
        
        print(f"Debug - Content to save: {content}")  # Debug print
        print(f"Debug - PDF path: {pdf_path}")  # Debug print
        
        # Créer le PDF
        doc = SimpleDocTemplate(pdf_path, pagesize=letter)
        
        # Créer le contenu du PDF
        from reportlab.platypus import Paragraph, Spacer
        from reportlab.lib.styles import getSampleStyleSheet
        
        styles = getSampleStyleSheet()
        story = []
        
        # Ajouter le prompt
        story.append(Paragraph(f"Prompt: {prompt}", styles['Heading1']))
        story.append(Spacer(1, 12))
        
        # Ajouter les URLs
        story.append(Paragraph("URLs analysées:", styles['Heading2']))
        for url in urls:
            story.append(Paragraph(url, styles['Normal']))
        story.append(Spacer(1, 12))
        
        # Ajouter le contenu gnéré
        story.append(Paragraph("Contenu généré:", styles['Heading2']))
        # Échapper les caractères spéciaux HTML
        from xml.sax.saxutils import escape
        content = escape(content)
        story.append(Paragraph(content, styles['Normal']))
        
        # Générer le PDF
        doc.build(story)
        
        if not os.path.exists(pdf_path):
            raise ValueError(f"PDF file was not created at {pdf_path}")
            
        return pdf_path
    except Exception as e:
        print(f"Erreur détaillée lors de la génération du PDF: {str(e)}")  # Pour le débogage
        import traceback
        traceback.print_exc()  # Affiche la stack trace complète
        return None

if __name__ == '__main__':
    app.run(debug=True)
