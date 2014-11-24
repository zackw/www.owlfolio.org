PY            ?= python
PELICAN       ?= pelican
PELICANOPTS    =
PORT           = 8000

BASEDIR	       = $(CURDIR)
INPUTDIR       = $(BASEDIR)/content
OUTPUTDIR      = $(BASEDIR)/output
CONFFILE       = $(BASEDIR)/pelican/conf.py
PUBLISHCONF    = $(BASEDIR)/pelican/conf_pub.py

# for server_helper
export PY PELICAN PELICANOPTS PORT BASEDIR INPUTDIR OUTPUTDIR CONFFILE
SERVER_HELPER  = $(BASEDIR)/pelican/server-helper

SSH_HOST       = owl-folio
SSH_PORT       = 22
SSH_USER       =
SSH_TARGET_DIR = .

ifeq ($(SSH_USER),)
SSH_DESTINATION :=             $(SSH_HOST):$(SSH_TARGET_DIR)
else
SSH_DESTINATION := $(SSH_USER)@$(SSH_HOST):$(SSH_TARGET_DIR)
endif

DEBUG ?= 0
ifeq ($(DEBUG),1)
	PELICANOPTS += -D
endif

define help_message
Makefile for a pelican Web site

Usage:
   make html                        (re)generate the web site
   make clean                       remove the generated files
   make regenerate                  regenerate files upon modification
   make publish                     generate using production settings
   make serve [PORT=8000]           serve site at http://localhost:8000
   make devserver [PORT=8000]       start/restart develop_server.sh
   make stopserver                  stop local server
   make ssh_upload                  upload the web site via SSH
   make rsync_upload                upload the web site via rsync+ssh

Set the DEBUG variable to 1 to enable debugging, e.g. make DEBUG=1 html
endef

help:
	$(file >/dev/stdout,$(help_message))

html:
	mkdir -p $(OUTPUTDIR)
	$(PELICAN) $(INPUTDIR) -o $(OUTPUTDIR) -s $(CONFFILE) $(PELICANOPTS)

clean:
	-rm -rf $(OUTPUTDIR) $(BASEDIR)/pelican/cache

regenerate:
	mkdir -p $(OUTPUTDIR)
	$(PELICAN) -r $(INPUTDIR) -o $(OUTPUTDIR) -s $(CONFFILE) $(PELICANOPTS)

serve: html
	cd $(OUTPUTDIR) && $(PY) -m pelican.server $(PORT)

devserver:
	mkdir -p $(OUTPUTDIR)
	$(SERVER_HELPER) restart

stopserver:
	$(SERVER_HELPER) stop

publish:
	$(PELICAN) $(INPUTDIR) -o $(OUTPUTDIR) -s $(PUBLISHCONF) $(PELICANOPTS)

ssh_upload: publish
	scp -P $(SSH_PORT) -r $(OUTPUTDIR)/* \
	    $(SSH_USER)@$(SSH_HOST):$(SSH_TARGET_DIR)

rsync_upload: publish
	rsync -e "ssh -p $(SSH_PORT)" -P -rvzc --delete $(OUTPUTDIR)/ \
	    $(SSH_USER)@$(SSH_HOST):$(SSH_TARGET_DIR) --cvs-exclude

.PHONY: html help clean regenerate serve devserver publish \
        ssh_upload rsync_upload
