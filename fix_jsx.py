with open('src/pages/Reports.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('''              )}
            </div>
          )}
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>''', '''              )}
            </div>
          )}
        </DialogContent>
      </Dialog>''')

with open('src/pages/Reports.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
