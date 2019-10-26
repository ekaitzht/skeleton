FROM mongo:4.0.12-xenial

RUN chown -R mongodb:mongodb /var/log /data/db 
USER mongodb
RUN touch  /var/log/mongodb/mongodb.log

CMD ["mongod"]


