#ifndef UTIL_H
#define UTIL_H

#include <QString>
#include <QStringListModel>
#include <QJsonObject>

class MiningPool
{
    QString name;
    QString url;
    QVector<QString> addresses;

    void read(const QJsonObject &json) {
        name = json["name"].toString();
        url = json["url"].toString();
    }

    void write(const QJsonObject &json) {
        json["name"] = name;
        json["url"] = url;
    }
};

class StringList : public QStringListModel
{
public:
  void append (const QString& string){
    insertRows(rowCount(), 1);
    setData(index(rowCount()-1), string);
  }
  StringList& operator<<(const QString& string){
    append(string);
    return *this;
  }
};

#endif // UTIL_H
