import os
import sys
import re
from bs4 import BeautifulSoup

def process_html_files():
    # Quarto passes helpful environment variables during rendering
    output_dir = os.environ.get("QUARTO_PROJECT_OUTPUT_DIR", "_site")
    
    for root, _, files in os.walk(output_dir):
        for file in files:
            if file.endswith("publications.html"):
                file_path = os.path.join(root, file)
                
                # Read the rendered HTML
                with open(file_path, "r", encoding="utf-8") as f:
                    soup = BeautifulSoup(f.read(), "html.parser")

                # The abstract field of the bib file is put in a block with class 'csl-block'
                # Fortunately this class is not used otherwise
                abstracts = soup.find_all('div', class_='csl-block')

                # Reinstate paragraphs in the abstract
                for abs in abstracts:
                    for element in list(abs.descendants):
                        if isinstance(element, NavigableString) and bool(re.search(r"(?<=\w)[.](?=\w)", element)):
                            # Split text by newline
                            parts = re.split(r"(?<=\w)[.](?=\w)", element)
                            
                            # Replace the original text node with the first part
                            element.replace_with(parts[0])
                            current_node = div.find(text=parts[0])
                            
                            # Insert <br> tags and the remaining text parts sequentially
                            for part in parts[1:]:
                                br = soup.new_tag("br")
                                current_node.insert_after(br)
                                
                                text_node = NavigableString(part)
                                br.insert_after(text_node)
                                current_node = text_node

                    # abs_text = abs.get_text()
                    # abs_para = re.sub(r"(?<=\w)[.](?=\w)", ".<br><br>", abs_text)
                    # abs.string.replace_with(abs_para, "html.parser")           

                for abs in abstracts:
                    contents = abs.contents[:]

                    # Create a collapsible (details) block with Abstract as the title
                    abs_collapse = soup.new_tag('details', style = 'text-indent: 0em;')
                    abs_header = soup.new_tag('summary')
                    abs_header.string = "Abstract"
                    abs_collapse.insert(0, abs_header)

                    # Put the existing contents of the csl-block into the collapsible block
                    for item in contents:
                        abs_collapse.append(item)

                    abs.clear()
                    abs.append(abs_collapse)


                # The links to the full document are better shown as icons rather than as the full URL
                links = soup.select('div.csl-entry a')

                for link in links:
                    icon = soup.new_tag('i', **{'class': 'bi bi-filetype-pdf'})

                    link.clear()
                    link.append(icon)
                    link['aria-label']='Link to document'

                    spacer = soup.new_string('\u2003')
                    link.insert_before(spacer)

                # Overwrite the file with changes
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(str(soup))
                print(f"Processed: {file}")

if __name__ == "__main__":
    process_html_files()
