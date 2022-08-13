> https://cloud.tencent.com/developer/article/1643292

## 1. mongodb是什么？
MongoDB是由`C++`语言编写的，是一个`基于分布式文件存储`的开源数据库系统。在高负载的情况下，添加更多的节点，可以保证服务器的性能。MongoDB旨在为WEB应用提供可拓展的高性能数据库存储解决方案。

MongDB将数据存储给一个文档，数据结构由键值（key=> value）队组成。MongoDB文档类似于JSON对象。字段值可以包含其他文档，数据及文档数组。




## 2. mongOdb有哪些特点？
- MongDB是一个面向文档存储的数据库，操作起来比较简单和容易
- 你可以在MongoDB记录中设置任何属性的索引（如：FirstName="Sammeer"，Address="8 Gandhi Road"）来实现更快的排序
- 你可以通过本地或网络创建数据镜像，这使得MongoDB有更强的拓展性
- 如果负载的增加（需要更多的存储空间和更强的处理能力），它可以分布在计算机网络中的其它节点上，这就是所谓的分片
- MongoDB支持丰富的查询表达式，查询指令使用JSON形式的标记，可轻易查询文档中内嵌的对象及数组
- MongoDB使用update()命令可以实现替换完成的文档（数据）或一些指定的数据字段
- MongoDB中的Map/reduce主要是用来对数据进行批量处理和聚合操作
- Map和Reduce。Map函数调用emit(key, value)遍历集合中所有的记录，将key与value传给Reduce函数进行处理
- Map函数和Reduce函数是使用JavaScript编写的，并可以通过db.runCommand或mapreduce命令来执行MapReduce操作
- GridFS是MongoDB中的一个内置功能，可以用于存储大量小文件
- MongoDB允许在服务端执行脚本，可以用JavaScript编写某个函数，直接在服务端执行，也可以把函数的定义存储服务端，下次直接调用即可。




## 3. 你说的NoSQL数据库是什么意思？NoSQL与RDBMS直接有什么区别？为什么要使用和不使用NoSQL数据库？说一说NoSQL数据库的几个优点？
NoSQL是非关系型数据库，NoSQL = Not Only SQL

关系型数据库采用的结构化的数据，NoSQL采用得是键值对的方式存储数据

在存储非结构化/半结构化的大数据时，在水平方向上进行拓展的时候;随时应对动态增加的数据项可以优先使用NoSQL数据库

再考虑数据库的成熟度；支持丶分析和商业智能；管理及专业性等问题时，优先先考虑关系型数据库




## 4. NoSQL数据库有哪些类型？
MongoDB丶Cassandra丶CouchDB丶Hypertable丶Redis丶Riak丶HBASE丶Mencache




## 5. MySQL与MongoDB之间最基本的差别是什么？
MySQL和MongoDB两者都是免费开源的数据库。MySQL和MongoDB有很多差别包括数据的表示(data representation)丶查询丶关系丶事务丶schema的设计和定义，非标准化，速度和性能

通过比较MySQL和MongoDB，实际上我们是在比较关系型和非关系型数据库，即数据库存储结构不同。




## 6. 你怎么比较MongODB丶CoushDB及CoushBase?
MongoDB和CoushDB都是面向文档的数据库。
MongDB和CoushDB都是开源NoSQL数据库的最典型代表
除了以文档形式存储以外没有其他的共同点。

MongDB和CouchDB在数据模型实现丶接口 丶对象存储以及复制方法等方面有很多不同。




## 7. MongDB成为最好的NoSQL数据库的原因是什么？
- 面向文件
- 高性能
- 高可用性
- 易拓展性
- 丰富的查询语言    




## 8. journal回放在条目(entry)不完整时（比如恰巧有一个中途故障了）会遇到问题吗？
每个journal(group)的写操作都是一致的，除非它是完整的，否则在恢复过程中它不会回放。




## 9. 分析器在MongoDB中的作用是什么？
- MongoDB中包括了一个可以显示数据库中每个操作性能特点的数据库分析器。通过这个分析器你可以找到比预期慢的查询（或读写操作）；
- 利用这一信息，比如，可以确定是否需要添加索引。




## 10. 名字空间(namespace)是什么？
MongoDB存储BSON对象在丛集（collection）中。数据库名字和丛集名字以句点连接起来叫做名字空间(namespace)。




## 11. 如果用户移除对象属性，该属性是否从存储层中删除？
是的，用户移除属性然后对象会重新保存(re-save())




## 12. 能否使用日志特征进行安全备份？
是的




## 13. 允许空值null吗？
对于对象成员而言，是的。然而用户不能添加空值（null）到数据库丛集(colletion)。因为空值不是对象，然而用户能够添加空对象{}




##  14. 更新操作立即fasync到磁盘？
不会的，磁盘写操作默认是延迟执行的。写操作可能是两三秒内（默认是在60秒内）后到达磁盘。例如，如果一秒内数据库收到一千个对一个对象递增的操作，仅刷新磁盘一次。（注意，尽管fsync选项是命令行和经过getLastError_old是有效的）




## 15. 如何执行事务/加锁？
MongoDB没有使用传统的锁或复杂的带回滚的事务，因为它设计的宗旨是轻量，快速以及可预计的高性能。可以把它类比成MySQLMylSAM的自动提交模式。通过精简对事务的支持，性能得到了提升，特别是在一个可能会穿过多个服务器的系统里。





## 16. 为什么我的数据文件如此庞大？
MongoDB会积极的预分配预留空间来防止文件系统碎片。




## 17. 启用备份故障恢复需要多久？
从备份数据库声明主数据库宕机到选出一个备份数据库作为新的主数据库将花费10到30秒时间。这期间在主数据库上的操作将会失败 -- 包括写入和强一致性读取（strong consistent read）操作。然而，你还能在第二数据库上执行一致性查询（eventually consistent query）(在slaveOk模式下)，即使在这段时间里




## 18. 什么是master或primary？
它是当前备份集群(reolica set)中负责处理所有写入操作的主要节点/成员。

在一个备份集群中，当失效备援（failover）事件发生时，一个另外的成员会变成primary

## 19. 什么是secondary或slave
Secondary从当前的primary上复制相应的操作。它是通过跟踪复制oplog(local.oplog.rs)做到的。



## 20. 我必须调用getLastError来确保写操作生效了么？
- 不用。不管你有没有调用getLastError(又叫`Safe Mode`)服务器做的操作都一样。
- 调用getLastError只是为了确认写操作成功提交。当然，你经常想得到确认，但是写操作的安全性和是否生效不是由这个决定的。










