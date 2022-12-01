PELICAN       ?= pelican
PELICANOPTS    =
PORT           = 8000

BASEDIR	       = $(CURDIR)
INPUTDIR       = $(BASEDIR)/content
OUTPUTDIR      = $(BASEDIR)/output
CONFFILE       = $(BASEDIR)/pelican/conf.py
PUBLISHCONF    = $(BASEDIR)/pelican/conf_pub.py
DEVSERVER      = $(BASEDIR)/pelican/devserver
REDIRS         = $(BASEDIR)/pelican/redir.cfg

# for server-helper
export PELICAN PELICANOPTS BASEDIR INPUTDIR OUTPUTDIR CONFFILE
export DEVSERVER REDIRS PORT

SERVER_HELPER  = $(BASEDIR)/pelican/server-helper

SSH_HOST       = owlfolio
SSH_PORT       = 22
SSH_USER       =
SSH_TARGET_DIR = .

ifeq ($(SSH_USER),)
SSH_USERHOST    :=             $(SSH_HOST)
else
SSH_USERHOST    := $(SSH_USER)@$(SSH_HOST)
endif
SSH_DESTINATION := $(SSH_USERHOST):$(SSH_TARGET_DIR)

DEBUG ?= 0
ifeq ($(DEBUG),1)
	PELICANOPTS += -D
endif

define help_message
Makefile for a pelican Web site

Usage:
   make html                        (re)generate the web site
   make publish                     generate using production settings
   make clean                       remove the generated files
   make regenerate                  regenerate files upon modification
   make serve [PORT=8000]           serve site at http://localhost:8000
   make devserver [PORT=8000]       serve site and regenerate files
   make stopserver                  stop local servers
   make upload                      upload the web site via rsync+ssh

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
	$(SERVER_HELPER) restart pelican

serve: html
	$(SERVER_HELPER) restart http

devserver:
	mkdir -p $(OUTPUTDIR)
	$(SERVER_HELPER) restart

stopserver:
	$(SERVER_HELPER) stop

publish:
	$(PELICAN) $(INPUTDIR) -o $(OUTPUTDIR) -s $(PUBLISHCONF) $(PELICANOPTS)

upload: publish
	rsync -e "ssh -p $(SSH_PORT)" -P -rvzc --delete \
	    --cvs-exclude --exclude /comments/ --exclude /.htaccess.gz \
	    --exclude /s/.webassets-cache/ \
	    $(OUTPUTDIR)/ $(SSH_DESTINATION)/
	ssh -p $(SSH_PORT) $(SSH_USERHOST) \
	    mkdir -p $(SSH_TARGET_DIR)/.well-known/acme-challenge/

.PHONY: html help clean regenerate serve devserver publish \
        upload
