#! /bin/sh

## Defaults match defaults in Makefile

PY="${PY:-python}"
PELICAN="${PELICAN:-pelican}"
PELICANOPTS="${PELICANOPTS:-}"
PORT="${PORT:-8000}"
BASEDIR="${BASEDIR:-$(pwd)}"
INPUTDIR="${INPUTDIR:-${BASEDIR}/content}"
OUTPUTDIR="${OUTPUTDIR:-${BASEDIR}/output}"
CONFFILE="${CONFFILE:-${BASEDIR}/pelicanconf.py}"

## Not known to the Makefile

SRV_PIDFILE="${BASEDIR}/srv.pid"
PELICAN_PIDFILE="${BASEDIR}/pelican.pid"

alive()
{
    kill -0 "$1" >/dev/null 2>&1
}

stop_1()
{
    pidfile="$1"; shift
    if [ -f "$pidfile" ]; then
        pid="$(cat "$pidfile")"
        if alive "$pid"; then
            echo Stopping "$@"
            kill "$pid"
        fi
        rm "$pidfile"
    fi
}

stop()
{
    stop_1 "$SRV_PIDFILE" "HTTP server"
    stop_1 "$PELICAN_PIDFILE" "Pelican"
}

start()
{
    echo "Starting Pelican..."

    # word splitting wanted for PELICANOPTS
    "$PELICAN" --debug --autoreload \
        -r "$INPUTDIR" -o "$OUTPUTDIR" -s "$CONFFILE" \
        $PELICANOPTS &

    pelican_pid="$!"
    sleep 1
    if ! alive "$pelican_pid"; then
        echo "Pelican didn't start. Is the Pelican package installed?" >&2
        exit 1
    fi
    echo "$pelican_pid" > "$PELICAN_PIDFILE"

    cd "$OUTPUTDIR" || {
        echo "$OUTPUTDIR inaccessible.  Check configuration." >&2
        stop_1 "$PELICAN_PIDFILE" "Pelican"
        exit 1
    }

    echo "Starting HTTP server on port $PORT..."
    "$PY" -m pelican.server "$PORT" &
    srv_pid="$!"
    cd - > /dev/null

    sleep 1
    if ! alive "$srv_pid"; then
        echo "The HTTP server didn't start. " >&2
        echo "Is there another service using port $PORT?" >&2
        stop_1 "$PELICAN_PIDFILE" "Pelican"
        exit 1
    fi
    echo "$srv_pid" > "$SRV_PIDFILE"

    echo 'Pelican and HTTP server processes now running in background.'
}

###
#  MAIN
###

usage()
{
    exec >&2
    echo "usage: $0 stop|start|restart"
    echo "This starts Pelican in debug and reload mode and then launches"
    echo "an HTTP server to help site development."
    echo "Should normally be invoked via 'make devserver' or 'make stopserver'."
    exit 2
}

if [ "$#" -ne 1 ]; then
    usage
fi

case "$1" in
    (stop)    stop;;
    (start)   start;;

    (restart) stop
              start;;

    (*)       usage;;
esac
